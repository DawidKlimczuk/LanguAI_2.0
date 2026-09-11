'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSessionUser, buyShopItem, consumeSkip } from '@/app/dashboard/actions'
import { 
  Heart, 
  ShoppingBag, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Loader2,
  X,
  GraduationCap,
  FastForward
} from 'lucide-react'

const THEME_CONFIG: Record<string, { bg: string; primaryBtn: string; accentText: string; cardBorder: string; textColor: string }> = {
  powder_pink: {
    bg: 'from-[#fff5f8] via-[#ffe8f0] to-[#ffd1dc]',
    primaryBtn: 'from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-slate-900 shadow-pink-300/50',
    accentText: 'text-pink-600',
    cardBorder: 'border-pink-200/80 bg-white/75 backdrop-blur-xl',
    textColor: 'text-slate-800'
  },
  green: {
    bg: 'from-[#021b10] via-[#04331e] to-[#0a5231]',
    primaryBtn: 'from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-emerald-600/30',
    accentText: 'text-emerald-400',
    cardBorder: 'border-emerald-500/20 bg-black/40',
    textColor: 'text-slate-100'
  },
  blue: {
    bg: 'from-[#031525] via-[#05325c] to-[#005288]',
    primaryBtn: 'from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-600/30',
    accentText: 'text-cyan-400',
    cardBorder: 'border-cyan-500/20 bg-black/40',
    textColor: 'text-slate-100'
  },
  gold: {
    bg: 'from-[#191102] via-[#3d2906] to-[#6b4708]',
    primaryBtn: 'from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-amber-500/30',
    accentText: 'text-amber-300',
    cardBorder: 'border-amber-500/20 bg-black/40',
    textColor: 'text-slate-100'
  },
  cyberpunk: {
    bg: 'from-[#1a002c] via-[#38004f] to-[#050014]',
    primaryBtn: 'from-fuchsia-600 to-cyan-500 hover:from-fuchsia-500 hover:to-cyan-400 text-white shadow-fuchsia-600/40',
    accentText: 'text-fuchsia-400',
    cardBorder: 'border-fuchsia-500/25 bg-black/50',
    textColor: 'text-slate-100'
  },
  default: {
    bg: 'from-[#1d0633] via-[#3d0f5a] to-[#d500f9]',
    primaryBtn: 'from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-pink-600/30',
    accentText: 'text-pink-400',
    cardBorder: 'border-white/10 bg-black/40',
    textColor: 'text-slate-100'
  }
}

const T = {
  pl: {
    exit: 'Zapisz i wyjdź',
    question: 'Pytanie',
    thinking: 'AI przygotowuje zestaw pytań...',
    nextBtn: 'Następne pytanie',
    skipBtn: 'Użyj Skip',
    finishTitle: 'Lekcja ukończona!',
    finishDesc: 'Zdobyto 50 bonusowych XP i zapisano postęp w profilu.',
    gameOverTitle: 'Brak serc!',
    gameOverDesc: 'Straciłeś wszystkie serca. Odnów je w sklepie, aby kontynuować.',
    quickShop: 'Szybki Sklep',
    buy: 'Kup',
    errorRateLimit: 'Limit zapytań AI osiągnięty. Odczekaj chwilę.',
    errorAi: 'Problem z siecią.',
    retryBtn: 'Spróbuj ponownie',
    levels: { A1: 'A1', A2: 'A2', B1: 'B1', B2: 'B2', C1: 'C1', C2: 'C2' }
  },
  en: {
    exit: 'Save & Exit',
    question: 'Question',
    thinking: 'AI is generating questions...',
    nextBtn: 'Next Question',
    skipBtn: 'Use Skip',
    finishTitle: 'Lesson Finished!',
    finishDesc: 'Earned 50 bonus XP and saved your progress.',
    gameOverTitle: 'No Hearts Left!',
    gameOverDesc: 'Refill them in the shop to continue.',
    quickShop: 'Quick Shop',
    buy: 'Buy',
    errorRateLimit: 'Rate limit reached. Please wait.',
    errorAi: 'Network glitch.',
    retryBtn: 'Try again',
    levels: { A1: 'A1', A2: 'A2', B1: 'B1', B2: 'B2', C1: 'C1', C2: 'C2' }
  },
  de: {
    exit: 'Beenden',
    question: 'Frage',
    thinking: 'KI bereitet Fragen vor...',
    nextBtn: 'Nächste Frage',
    skipBtn: 'Überspringen',
    finishTitle: 'Lektion abgeschlossen!',
    finishDesc: '50 Bonus-XP erhalten.',
    gameOverTitle: 'Keine Herzen mehr!',
    gameOverDesc: 'Kaufe neue im Laden.',
    quickShop: 'Schnellladen',
    buy: 'Kaufen',
    errorRateLimit: 'Limit erreicht. Bitte kurz warten.',
    errorAi: 'Netzwerkfehler.',
    retryBtn: 'Erneut versuchen',
    levels: { A1: 'A1', A2: 'A2', B1: 'B1', B2: 'B2', C1: 'C1', C2: 'C2' }
  },
  ru: {
    exit: 'Выход',
    question: 'Вопрос',
    thinking: 'ИИ готовит вопросы...',
    nextBtn: 'Следующий вопрос',
    skipBtn: 'Пропустить',
    finishTitle: 'Урок пройден!',
    finishDesc: 'Получено 50 бонусных XP.',
    gameOverTitle: 'Закончились жизни!',
    gameOverDesc: 'Пополните их в магазине.',
    quickShop: 'Быстрый магазин',
    buy: 'Купить',
    errorRateLimit: 'Лимит запросов. Подождите.',
    errorAi: 'Сетевой сбой.',
    retryBtn: 'Попробовать снова',
    levels: { A1: 'A1', A2: 'A2', B1: 'B1', B2: 'B2', C1: 'C1', C2: 'C2' }
  }
}

interface QuestionData {
  question: string
  options: string[]
  correct_index: number
  explanation: string
}

function LearnQuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = searchParams.get('lang') || 'Angielski'

  const [user, setUser] = useState<any>(null)
  const [qIndex, setQIndex] = useState(0)
  const [questionPool, setQuestionPool] = useState<QuestionData[]>([])
  const [cefrCode, setCefrCode] = useState('A1')
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [loadingBatch, setLoadingBatch] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [shopOpen, setShopOpen] = useState(false)
  const [modalStatus, setModalStatus] = useState<'finish' | 'gameover' | null>(null)

  const initRef = useRef(false)

  async function fetchBatch() {
    setLoadingBatch(true)
    setErrorMsg(null)
    setSelectedOpt(null)
    setIsAnswered(false)

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_batch', lang })
      })

      const data = await res.json()

      if (res.status === 429) {
        setErrorMsg(t.errorRateLimit)
        return
      }

      if (data.questions && Array.isArray(data.questions)) {
        setQuestionPool(data.questions)
        if (data.cefrCode) setCefrCode(data.cefrCode)
      } else {
        setErrorMsg(t.errorAi)
      }
    } catch (e) {
      setErrorMsg(t.errorAi)
    } finally {
      setLoadingBatch(false)
    }
  }

  function handleNext() {
    if (qIndex >= 19) {
      setModalStatus('finish')
      return
    }

    const nextIndex = qIndex + 1
    setQIndex(nextIndex)
    setSelectedOpt(null)
    setIsAnswered(false)

    if (nextIndex % 5 === 0) {
      fetchBatch()
    }
  }

  async function handleSkipQuestion() {
    if ((user?.skipCount ?? 0) <= 0 || !currentQ) return

    try {
      const res = await consumeSkip(lang, qIndex)
      if (res.success) {
        // Natychmiast aktualizujemy stan usera w komponencie
        setUser((prev: any) => ({
          ...prev,
          skipCount: res.remainingSkips
        }))
        // Przechodzimy do kolejnego pytania
        handleNext()
      } else {
        alert(res.error || 'Nie udało się zużyć pominięcia')
      }
    } catch (e) {
      console.error('Błąd zużycia skipa:', e)
    }
  }

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    getSessionUser().then((u) => {
      setUser(u)
      if ((u?.hearts ?? 0) <= 0) {
        setModalStatus('gameover')
      } else {
        const startProgress = (u?.savedQuizLang === lang && typeof u?.savedQuizProgress === 'number')
          ? u.savedQuizProgress
          : 0
        setQIndex(startProgress)
        fetchBatch()
      }
    })
  }, [lang])

  const t = T[(user?.interfaceLanguage as 'pl' | 'en' | 'de' | 'ru') || 'pl'] || T.pl
  const currentQ = questionPool[qIndex % 5] || null

  async function handleSelect(index: number) {
    if (isAnswered || !currentQ || !user) return
    setSelectedOpt(index)
    setIsAnswered(true)

    const isOk = index === currentQ.correct_index

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_answer',
          ok: isOk,
          lang,
          qIndex,
          questionText: currentQ.question
        })
      })

      const updatedStats = await res.json()
      setUser((prev: any) => ({
        ...prev,
        hearts: updatedStats.heartsLeft,
        gems: updatedStats.gemsNow,
        xp: updatedStats.xpNow
      }))

      if ((updatedStats.heartsLeft ?? 0) <= 0 && !isOk) {
        setTimeout(() => setModalStatus('gameover'), 1200)
      }
    } catch (e) {
      console.error('Błąd zapisu', e)
    }
  }

  async function handleBuy(id: number, cost: number) {
    const res = await buyShopItem(id, cost)
    if (res.success) {
      const u = await getSessionUser()
      setUser(u)
      setShopOpen(false)
      if ((u?.hearts ?? 0) > 0 && modalStatus === 'gameover') {
        setModalStatus(null)
      }
    } else {
      alert(res.error)
    }
  }

  const themeCode = user?.theme || 'default'
  const theme = THEME_CONFIG[themeCode] || THEME_CONFIG.default

  return (
    <div className={`min-h-screen bg-linear-to-br ${theme.bg} ${theme.textColor} flex flex-col justify-between p-4 sm:p-8 transition-colors duration-500`}>
      {/* NAGŁÓWEK QUIZU */}
      <header className="max-w-3xl w-full mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-black/30 md:bg-transparent p-3 md:p-0 rounded-2xl border border-white/10 md:border-none backdrop-blur-md md:backdrop-blur-none">
        
        {/* RZĄD 1 (Na mobile: Góra | Na PC: Lewa i Prawa strona wokół paska) */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          {/* Przycisk powrotu */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 font-bold text-xs sm:text-sm transition-all text-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
            <span>{t.exit}</span>
          </button>

          {/* Statystyki: Skipy, Gemy, Serca - Na telefonie wyrównane do prawej */}
          <div className="flex items-center gap-2 sm:gap-3 md:hidden">
            {(user?.skipCount ?? 0) > 0 && !isAnswered && (
              <button
                onClick={handleSkipQuestion}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-black text-xs transition-all"
                title="Pomiń to pytanie"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>{user.skipCount}</span>
              </button>
            )}

            <button
              onClick={() => setShopOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-cyan-400 font-bold text-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{user?.gems ?? 0}</span>
            </button>

            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-rose-400 font-bold text-xs">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>{user?.hearts ?? 0}</span>
            </div>
          </div>
        </div>

        {/* RZĄD 2 NA MOBILE / ŚRODEK NA PC: Pasek postępu i numer pytania */}
        <div className="w-full md:flex-1 md:max-w-md md:mx-4">
          <div className="flex justify-between items-center text-xs font-black mb-1.5 px-1">
            <span className={`flex items-center gap-1.5 ${theme.accentText}`}>
              <GraduationCap className="w-4 h-4" />
              {cefrCode} • {t.question} {qIndex + 1} / 20
            </span>
            <span className="text-slate-400 font-bold">{Math.round(((qIndex + 1) / 20) * 100)}%</span>
          </div>
          <div className="w-full bg-black/50 h-2.5 sm:h-3 rounded-full border border-white/10 overflow-hidden p-0.5">
            <div
              className={`bg-linear-to-r ${theme.primaryBtn} h-full rounded-full transition-all duration-500`}
              style={{ width: `${((qIndex + 1) / 20) * 100}%` }}
            />
          </div>
        </div>

        {/* PRAWA STRONA NA PC (Ukryta na telefonie, bo przeniesiona do rzędu 1) */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          {(user?.skipCount ?? 0) > 0 && !isAnswered && (
            <button
              onClick={handleSkipQuestion}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-black text-xs transition-all"
              title="Pomiń to pytanie"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>{user.skipCount}</span>
            </button>
          )}

          <button
            onClick={() => setShopOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-cyan-400 font-bold text-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{user?.gems ?? 0}</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-rose-400 font-bold text-xs">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>{user?.hearts ?? 0}</span>
          </div>
        </div>
      </header>

      {/* KARTA PYTANIA */}
      <main className="max-w-2xl w-full mx-auto my-auto py-8">
        <div className={`border rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden ${theme.cardBorder}`}>
          {loadingBatch ? (
            <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
              <Loader2 className={`w-10 h-10 animate-spin ${theme.accentText}`} />
              <p className="text-base font-semibold animate-pulse">{t.thinking}</p>
            </div>
          ) : errorMsg ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
              <p className="text-rose-400 font-semibold text-sm max-w-md">{errorMsg}</p>
              <button
                onClick={fetchBatch}
                className={`px-6 py-2.5 rounded-xl bg-linear-to-r ${theme.primaryBtn} font-bold text-xs shadow-lg`}
              >
                {t.retryBtn}
              </button>
            </div>
          ) : currentQ ? (
            <div>
              <h2 className="text-xl sm:text-2xl font-black mb-8 leading-snug">
                {currentQ.question}
              </h2>

              <div className="grid grid-cols-1 gap-3.5 mb-6">
                {currentQ.options.map((opt, i) => {
                  let optStyle = 'bg-black/30 border-white/10 hover:border-white/30 hover:scale-[1.01]'

                  if (isAnswered) {
                    if (i === currentQ.correct_index) {
                      optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20 font-black'
                    } else if (i === selectedOpt) {
                      optStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-black'
                    } else {
                      optStyle = 'opacity-30 border-white/5'
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => handleSelect(i)}
                      className={`w-full p-4 rounded-2xl border text-left font-bold text-sm sm:text-base flex items-center justify-between transition-all ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && i === currentQ.correct_index && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {isAnswered && i === selectedOpt && i !== currentQ.correct_index && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                      )}
                    </button>
                  )
                })}
              </div>

              {isAnswered && (
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                  <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-medium">
                    💡 {currentQ.explanation}
                  </p>
                  <button
                    onClick={handleNext}
                    className={`w-full py-3.5 rounded-xl bg-linear-to-r ${theme.primaryBtn} font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95`}
                  >
                    {t.nextBtn} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </main>

      <div className="h-6" />

      {/* SZYBKI SKLEP */}
      {shopOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShopOpen(false)} />
          <div className="relative w-full max-w-sm bg-slate-950/95 border border-white/15 rounded-3xl p-6 z-10 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className={`text-lg font-black flex items-center gap-2 ${theme.accentText}`}>
                <ShoppingBag className="w-5 h-5" /> {t.quickShop}
              </h3>
              <button onClick={() => setShopOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { id: 1, name: 'Odnów Serce (+1 ❤️)', cost: 50, icon: '❤️' },
                { id: 2, name: 'Pełne Zdrowie (+5 ❤️)', cost: 200, icon: '💖' },
                { id: 8, name: 'Pominięcie (Skip ⏩)', cost: 120, icon: '⏩' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h5 className="font-bold text-xs">{item.name}</h5>
                      <span className="text-cyan-400 text-xs font-bold">{item.cost} 💎</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuy(item.id, item.cost)}
                    className={`px-4 py-1.5 rounded-lg bg-linear-to-r ${theme.primaryBtn} font-bold text-xs`}
                  >
                    {t.buy}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL KOŃCA QUIZU */}
      {modalStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />
          <div className="relative w-full max-w-sm bg-slate-950/95 border border-white/15 rounded-3xl p-8 z-10 shadow-2xl text-center space-y-4">
            <div className="text-5xl mb-2">
              {modalStatus === 'finish' ? '🏆' : '💔'}
            </div>
            <h3 className="text-2xl font-black text-white">
              {modalStatus === 'finish' ? t.finishTitle : t.gameOverTitle}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              {modalStatus === 'finish' ? t.finishDesc : t.gameOverDesc}
            </p>

            <div className="pt-4 space-y-2">
              {modalStatus === 'gameover' && (
                <button
                  onClick={() => setShopOpen(true)}
                  className={`w-full py-3 rounded-xl bg-linear-to-r ${theme.primaryBtn} font-bold text-sm shadow-lg`}
                >
                  🛒 Otwórz sklep
                </button>
              )}
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 font-bold text-sm text-white transition-all"
              >
                Wróć do menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function LearnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-pink-400 font-bold">
        Ładowanie lekcji...
      </div>
    }>
      <LearnQuizContent />
    </Suspense>
  )
}