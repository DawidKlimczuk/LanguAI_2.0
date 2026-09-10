import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

function extractAndParseJson(text: string): any {
  let cleaned = text.trim()
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '')
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '')
  }

  // Szukamy początku tablicy lub obiektu
  const firstBracket = cleaned.indexOf('[')
  const firstBrace = cleaned.indexOf('{')

  let jsonStr = cleaned
  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    const lastBracket = cleaned.lastIndexOf(']')
    if (lastBracket !== -1) {
      jsonStr = cleaned.substring(firstBracket, lastBracket + 1)
    }
  } else if (firstBrace !== -1) {
    const lastBrace = cleaned.lastIndexOf('}')
    if (lastBrace !== -1) {
      jsonStr = cleaned.substring(firstBrace, lastBrace + 1)
    }
  }

  try {
    const parsed = JSON.parse(jsonStr)
    if (Array.isArray(parsed)) return parsed
    if (Array.isArray(parsed?.questions)) return parsed.questions
    if (Array.isArray(parsed?.data)) return parsed.data
    return null
  } catch (err) {
    console.error('Błąd parsowania JSON:', err, 'Surowy fragment:', jsonStr.slice(0, 200))
    return null
  }
}

function calculateCefrCode(points: number): string {
  if (points < 10) return 'A1'
  if (points < 30) return 'A2'
  if (points < 60) return 'B1'
  if (points < 100) return 'B2'
  if (points < 150) return 'C1'
  return 'C2'
}

const TOPICS = [
  'Codzienne rozmowy',
  'Jedzenie i restauracja',
  'Podróże i transport',
  'Praca i technologia',
  'Zakupy i styl życia',
  'Zdrowie i samopoczucie'
]

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const userIdStr = cookieStore.get('userId')?.value
    if (!userIdStr) {
      return NextResponse.json({ error: 'Auth required' }, { status: 401 })
    }
    const userId = parseInt(userIdStr)

    const body = await req.json()
    const { action } = body

    const user: any = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // 1. ZUŻYCIE SKIP
    if (action === 'use_skip') {
      const { lang, qIndex } = body

      if ((user.skipCount ?? 0) <= 0) {
        return NextResponse.json({ error: 'Brak dostępnych skipów' }, { status: 400 })
      }

      const updatedUser: any = await prisma.user.update({
        where: { id: userId },
        data: {
          skipCount: { decrement: 1 },
          savedQuizLang: qIndex >= 19 ? null : lang,
          savedQuizProgress: qIndex >= 19 ? 0 : qIndex + 1
        }
      })

      return NextResponse.json({
        success: true,
        skipsLeft: updatedUser.skipCount ?? 0,
        heartsLeft: updatedUser.hearts ?? 5,
        gemsNow: updatedUser.gems ?? 0,
        xpNow: updatedUser.xp ?? 0
      })
    }

    // 2. GENEROWANIE PAKIETU 5 PYTAŃ
    if (action === 'get_batch') {
      const { lang } = body
      const appLang = user.interfaceLanguage || 'pl'

      const langNames: Record<string, string> = {
        pl: 'Polish',
        en: 'English',
        de: 'German',
        ru: 'Russian'
      }
      const instructionLang = langNames[appLang] || 'English'

      let progress = await prisma.userProgress.findFirst({
        where: { userId, targetLanguage: lang }
      })

      if (!progress) {
        progress = await prisma.userProgress.create({
          data: {
            userId,
            targetLanguage: lang,
            difficultyLevel: 1,
            correctCount: 0,
            wrongCount: 0,
            questionHistory: '[]',
            weakTopics: '[]'
          }
        })
      }

      const cefrLevel = calculateCefrCode(progress.correctCount ?? 0)
      const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)]

      const prompt = `Act as an expert language teacher.
Generate exactly 5 multiple-choice quiz questions for a student learning ${lang}.
Level: CEFR ${cefrLevel}.
Topic: ${randomTopic}.
CRITICAL LANGUAGE RULE: Question instructions, options guidance, and explanations MUST be entirely in ${instructionLang}.
Ensure output is ONLY a valid JSON array of 5 objects with no surrounding markdown or explanation:
[
  {
    "question": "Question text in ${instructionLang}",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_index": 0,
    "explanation": "Short 1-sentence grammar explanation in ${instructionLang}"
  }
]`

      const apiKey = process.env.GEMINI_API_KEY
      if (!apiKey) {
        return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 })
      }

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(apiKey)}`

      let parsedQuestions: any = null
      let lastError = ''

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2500,
                responseMimeType: 'application/json'
              }
            })
          })

          const data = await res.json()

          if (!res.ok) {
            lastError = data?.error?.message || JSON.stringify(data)
            console.error(`Gemini API Error (attempt ${attempt}):`, lastError)
            if (res.status === 429) {
              return NextResponse.json({ error: 'Limit zapytań AI. Odczekaj chwilę.', rateLimited: true }, { status: 429 })
            }
            await new Promise((r) => setTimeout(r, 1000))
            continue
          }

          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text
          if (rawText) {
            const list = extractAndParseJson(rawText)
            if (Array.isArray(list) && list.length > 0) {
              parsedQuestions = list
              break
            }
          }
        } catch (e: any) {
          lastError = e?.message || 'Błąd połączenia'
          await new Promise((r) => setTimeout(r, 800))
        }
      }

      if (!parsedQuestions) {
        console.error('Nie udało się sformatować pytań. Ostatni błąd:', lastError)
        return NextResponse.json({ error: `Błąd AI: ${lastError}` }, { status: 502 })
      }

      return NextResponse.json({
        questions: parsedQuestions,
        cefrCode: cefrLevel
      })
    }

    // 3. ZAPIS WYNIKU
    if (action === 'save_answer') {
      const { ok, lang, qIndex } = body

      let progress = await prisma.userProgress.findFirst({
        where: { userId, targetLanguage: lang }
      })

      if (!progress) {
        progress = await prisma.userProgress.create({
          data: {
            userId,
            targetLanguage: lang,
            difficultyLevel: 1,
            correctCount: 0,
            wrongCount: 0,
            questionHistory: '[]',
            weakTopics: '[]'
          }
        })
      }

      let updatedHearts = user.hearts ?? 5
      let updatedGems = user.gems ?? 0
      let updatedXp = user.xp ?? 0
      let updatedCorrect = user.totalCorrectAnswers ?? 0

      if (ok) {
        updatedXp += 10
        updatedGems += 5
        updatedCorrect += 1

        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: updatedXp,
            gems: updatedGems,
            totalCorrectAnswers: updatedCorrect
          }
        })

        await prisma.userProgress.update({
          where: { id: progress.id },
          data: { correctCount: { increment: 1 } }
        })
      } else {
        updatedHearts = Math.max(0, updatedHearts - 1)
        updatedXp = Math.max(0, updatedXp - 5)

        await prisma.user.update({
          where: { id: userId },
          data: { hearts: updatedHearts, xp: updatedXp }
        })

        await prisma.userProgress.update({
          where: { id: progress.id },
          data: { wrongCount: { increment: 1 } }
        })
      }

      if (qIndex >= 19) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            lessonsCompleted: { increment: 1 },
            savedQuizLang: null,
            savedQuizProgress: 0,
            xp: { increment: 50 }
          }
        })
      } else {
        await prisma.user.update({
          where: { id: userId },
          data: {
            savedQuizLang: lang,
            savedQuizProgress: qIndex + 1
          }
        })
      }

      return NextResponse.json({
        heartsLeft: updatedHearts,
        gemsNow: updatedGems,
        xpNow: updatedXp
      })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}