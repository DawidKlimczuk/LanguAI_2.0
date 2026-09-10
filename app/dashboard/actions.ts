'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getSessionUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) redirect('/')

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    include: {
      userAchievements: {
        include: { achievement: true },
        orderBy: { unlockedAt: 'desc' }
      }
    }
  })

  if (!user) redirect('/')
  return user
}

export async function setAppLanguage(lang: string) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (userId) {
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { interfaceLanguage: lang }
    })
  }
  return { success: true }
}

export async function updateUserProfile(formData: FormData) {
  const cookieStore = await cookies()
  const userId = parseInt(cookieStore.get('userId')?.value || '0')
  if (!userId) return { success: false, error: 'Brak autoryzacji' }

  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const oldPass = formData.get('old_pass') as string
  const newPass = formData.get('new_pass') as string
  const repPass = formData.get('rep_pass') as string

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return { success: false, error: 'Użytkownik nie istnieje' }

  const dataToUpdate: any = { username, email }

  if (oldPass || newPass || repPass) {
    if (!oldPass) return { success: false, error: 'Podaj aktualne hasło!' }
    const valid = await bcrypt.compare(oldPass, user.password)
    if (!valid) return { success: false, error: 'Aktualne hasło jest niepoprawne!' }
    if (newPass !== repPass) return { success: false, error: 'Hasła nie są identyczne!' }
    if (newPass.length < 4) return { success: false, error: 'Hasło musi mieć min. 4 znaki' }
    dataToUpdate.password = await bcrypt.hash(newPass, 10)
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate
    })
    return { success: true, message: 'Dane zostały pomyślnie zaktualizowane!' }
  } catch (e) {
    return { success: false, error: 'Ten adres email jest już zajęty!' }
  }
}

export async function equipTheme(themeCode: string) {
  const cookieStore = await cookies()
  const userId = parseInt(cookieStore.get('userId')?.value || '0')
  if (!userId) return { success: false, error: 'Brak autoryzacji' }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return { success: false, error: 'Brak użytkownika' }

  let unlocked: string[] = ['default']
  try {
    unlocked = JSON.parse((user as any).unlockedThemes || '["default"]')
  } catch (e) {
    unlocked = ['default']
  }

  if (!unlocked.includes(themeCode)) {
    return { success: false, error: 'Nie posiadasz tego motywu!' }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { theme: themeCode }
  })

  return { success: true, message: 'Aktywowano nowy motyw!' }
}

export async function buyShopItem(itemId: number, cost: number) {
  const cookieStore = await cookies()
  const userId = parseInt(cookieStore.get('userId')?.value || '0')
  if (!userId) return { success: false, error: 'Brak autoryzacji' }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || (user.gems ?? 0) < cost) {
    return { success: false, error: 'Za mało gemów!' }
  }

  let unlocked: string[] = ['default']
  try {
    unlocked = JSON.parse((user as any).unlockedThemes || '["default"]')
  } catch (e) {
    unlocked = ['default']
  }

  const currentHearts = user.hearts ?? 5

  // Sprawdzanie serc
  if (itemId === 1) {
    if (currentHearts >= 5) return { success: false, error: 'Masz już maksymalną liczbę serc (5/5)!' }
    await prisma.user.update({
      where: { id: userId },
      data: {
        gems: { decrement: cost },
        hearts: { increment: 1 },
        itemsBought: { increment: 1 }
      }
    })
    return { success: true, message: 'Odnawiasz 1 serce! (+1 ❤️)' }
  }

  if (itemId === 2) {
    if (currentHearts >= 5) return { success: false, error: 'Masz już maksymalną liczbę serc (5/5)!' }
    await prisma.user.update({
      where: { id: userId },
      data: {
        gems: { decrement: cost },
        hearts: 5,
        itemsBought: { increment: 1 }
      }
    })
    return { success: true, message: 'W pełni uleczono! (5/5 ❤️)' }
  }

  if (itemId === 3) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        gems: { decrement: cost },
        xp: { increment: 150 },
        itemsBought: { increment: 1 }
      }
    })
    return { success: true, message: 'Doświadczenie dodane! (+150 XP)' }
  }

  if (itemId === 8) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        gems: { decrement: cost },
        skipCount: { increment: 1 },
        itemsBought: { increment: 1 }
      }
    })
    return { success: true, message: 'Kupiono pominięcie pytania! (Skip +1 ⏩)' }
  }

  // Zakup motywów
  const themeMap: Record<number, string> = {
    4: 'gold',
    5: 'blue',
    6: 'green',
    7: 'powder_pink',
    9: 'cyberpunk'
  }

  const themeCode = themeMap[itemId]
  if (themeCode) {
    if (unlocked.includes(themeCode)) {
      await prisma.user.update({
        where: { id: userId },
        data: { theme: themeCode }
      })
      return { success: true, message: 'Aktywowano posiadany motyw!' }
    }

    unlocked.push(themeCode)
    await prisma.user.update({
      where: { id: userId },
      data: {
        gems: { decrement: cost },
        theme: themeCode,
        unlockedThemes: JSON.stringify(unlocked),
        itemsBought: { increment: 1 }
      }
    })
    return { success: true, message: 'Odblokowano i aktywowano nowy motyw!' }
  }

  return { success: false, error: 'Nieznany przedmiot' }
}

export async function claimDailyReward() {
  const cookieStore = await cookies()
  const userId = parseInt(cookieStore.get('userId')?.value || '0')
  if (!userId) return { success: false, error: 'Brak autoryzacji' }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return { success: false, error: 'Nie znaleziono użytkownika' }

  const lastClaim = user.lastDailyClaim ? new Date(user.lastDailyClaim).getTime() : 0
  const now = Date.now()

  if (now - lastClaim < 86400000) {
    const wait = 86400000 - (now - lastClaim)
    const h = Math.floor(wait / 3600000)
    const m = Math.floor((wait % 3600000) / 60000)
    return { success: false, error: `Nagrodę można odebrać za ${h}h ${m}m.` }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      gems: { increment: 200 },
      lastDailyClaim: new Date()
    }
  })

  return { success: true, message: 'Odebrano 200 gemów! 💎' }
}

export async function getLeaderboardData() {
  const topXp = await prisma.user.findMany({
    select: { id: true, username: true, xp: true, totalCorrectAnswers: true, lessonsCompleted: true, theme: true },
    orderBy: { xp: 'desc' },
    take: 10
  })

  const topGems = await prisma.user.findMany({
    select: { id: true, username: true, gems: true, theme: true },
    orderBy: { gems: 'desc' },
    take: 10
  })

  const progress = await prisma.userProgress.findMany({
    include: { user: { select: { username: true, theme: true } } },
    orderBy: { correctCount: 'desc' },
    take: 30
  })

  return { topXp, topGems, progress }
}

export async function consumeSkip(lang: string, qIndex: number) {
  const cookieStore = await cookies()
  const userId = parseInt(cookieStore.get('userId')?.value || '0')
  if (!userId) return { success: false, error: 'Brak autoryzacji' }

  const user: any = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || (user.skipCount ?? 0) <= 0) {
    return { success: false, error: 'Brak dostępnych skipów!' }
  }

  const updated: any = await prisma.user.update({
    where: { id: userId },
    data: {
      skipCount: { decrement: 1 },
      savedQuizLang: qIndex >= 19 ? null : lang,
      savedQuizProgress: qIndex >= 19 ? 0 : qIndex + 1
    }
  })

  return { 
    success: true, 
    remainingSkips: updated.skipCount ?? 0 
  }
}