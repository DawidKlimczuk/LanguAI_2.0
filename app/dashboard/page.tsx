'use client'

import { useState, useEffect } from 'react'
import { 
  getSessionUser, 
  buyShopItem, 
  claimDailyReward, 
  updateUserProfile, 
  setAppLanguage, 
  equipTheme, 
  getLeaderboardData 
} from './actions'
import { useRouter } from 'next/navigation'
import { 
  BookOpen, 
  ShoppingBag, 
  Trophy, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Heart, 
  Gem, 
  Sparkles, 
  Lock, 
  ChevronRight, 
  PlayCircle, 
  Clock, 
  Medal, 
  Check, 
  FastForward
} from 'lucide-react'

const T = {
  pl: {
    learn: 'Nauka',
    shop: 'Sklep & Nagrody',
    leaderboard: 'Ranking',
    achievements: 'Osiągnięcia',
    settings: 'Ustawienia',
    coursesTitle: 'Dostępne kursy językowe',
    startCourse: 'Rozpocznij naukę',
    continueTitle: 'Kontynuuj naukę!',
    continueDesc: 'Zatrzymałeś się w kursie',
    continueAt: 'na pytaniu',
    resumeBtn: 'Wznów lekcję',
    dailyTitle: '🎁 Codzienny Bonus',
    dailyDesc: 'Odbierz 200 darmowych gemów raz na 24h!',
    claimBtn: 'Odbierz 200 💎',
    claimedBtn: 'Odebrano',
    shopTitle: '🛒 Sklep Ekwipunku i Motywów',
    buy: 'Kup',
    use: 'Użyj',
    active: 'Aktywny',
    profileTitle: 'Ustawienia Konta',
    username: 'Nazwa użytkownika',
    email: 'Adres Email',
    passChange: 'Zmiana Hasła',
    oldPass: 'Aktualne Hasło',
    newPass: 'Nowe Hasło',
    repPass: 'Powtórz Nowe Hasło',
    saveBtn: 'Zapisz Zmiany',
    noHearts: 'Nie masz serc! Odnów je w sklepie.',
    lvl: 'Poziom',
    xpNeeded: 'Zbierz jeszcze',
    xpToNext: 'XP, aby odblokować kolejny poziom!',
    noAch: 'Brak odblokowanych osiągnięć. Rozwiąż quiz, aby zgarnąć pierwsze trofea!',
    rankXp: 'Ranking Doświadczenia (XP)',
    rankGems: 'Najbogatsi (Gemy)',
    rankLang: 'Mistrzowie Językowi',
    completedLessons: 'Ukończono lekcji:',
    youTag: '(Ty)',
    correctCountLabel: 'poprawnych',
    accuracyLabel: 'celności',
    noRankData: 'Brak wyników dla tego języka. Bądź pierwszy i rozwiąż lekcję!',
    gemsTab: 'Gemy',
    coursesTab: 'Kursy',
    courses: {
      Angielski: 'Angielski',
      Niemiecki: 'Niemiecki',
      Hiszpański: 'Hiszpański',
      Włoski: 'Włoski',
      Francuski: 'Francuski',
      Polski: 'Polski'
    },
    shopItems: {
      1: { name: 'Odnów Serce (+1 ❤️)', desc: 'Dodaje 1 punkt życia natychmiast' },
      2: { name: 'Pełne Zdrowie (+5 ❤️)', desc: 'Kompletne odnowienie paska serc (5/5)' },
      3: { name: 'Booster XP (+150 XP)', desc: 'Szybki zastrzyk punktów doświadczenia' },
      8: { name: 'Pominięcie Pytania (Skip ⏩)', desc: 'Pozwala pominąć trudne pytanie w quizie' },
      7: { name: 'Motyw Powder Pink 🌸', desc: 'Perłowa biel połączona z pudrowym różem' },
      5: { name: 'Motyw Ocean Blue 🌊', desc: 'Głęboki błękit i chłodne cyjanowe akcenty' },
      6: { name: 'Motyw Emerald Forest 🌲', desc: 'Spokojna szmaragdowa zieleń natury' },
      4: { name: 'Królewskie Złoto 👑', desc: 'Ekskluzywny motyw Premium Gold' },
      9: { name: 'Cyberpunk Neon ⚡', desc: 'Futurystyczny fiolet z ostrym neonem' }
    },
    ach: {
      registration: { title: 'Witaj w LanguAI', desc: 'Dołączyłeś do społeczności.' },
      first_blood: { title: 'Pierwsza Krew', desc: 'Pierwsza poprawna odpowiedź.' },
      first_lesson: { title: 'Pierwszy Dzwonek', desc: 'Ukończono pierwszą lekcję.' },
      xp_100: { title: 'Uczeń', desc: 'Zdobądź 100 XP.' },
      xp_500: { title: 'Student', desc: 'Zdobądź 500 XP.' },
      xp_1000: { title: 'Ekspert', desc: 'Zdobądź 1000 XP.' },
      xp_5000: { title: 'Mistrz', desc: 'Zdobądź 5000 XP.' },
      xp_10000: { title: 'Legenda', desc: 'Zdobądź 10000 XP.' },
      gems_50: { title: 'Zbieracz', desc: 'Zdobądź 50 gemów.' },
      gems_200: { title: 'Bankier', desc: 'Zdobądź 200 gemów.' },
      gems_1000: { title: 'Milioner', desc: 'Zdobądź 1000 gemów.' },
      spender_1: { title: 'Klient', desc: 'Kup przedmiot w sklepie.' },
      spender_5: { title: 'Szoping', desc: 'Kup 5 przedmiotów.' },
      answers_10: { title: 'Rozgrzewka', desc: '10 poprawnych odpowiedzi.' },
      answers_50: { title: 'Mózgowiec', desc: '50 poprawnych odpowiedzi.' },
      answers_100: { title: 'Geniusz', desc: '100 poprawnych odpowiedzi.' },
      answers_500: { title: 'Omnibus', desc: '500 poprawnych odpowiedzi.' },
      lessons_5: { title: 'Pilny Uczeń', desc: 'Ukończ 5 lekcji.' },
      lessons_20: { title: 'Stały Bywalec', desc: 'Ukończ 20 lekcji.' },
      survivor: { title: 'Ocalony', desc: 'Ukończ lekcję mając 1 serce.' }
    }
  },
  en: {
    learn: 'Learn',
    shop: 'Shop & Perks',
    leaderboard: 'Leaderboard',
    achievements: 'Achievements',
    settings: 'Settings',
    coursesTitle: 'Available Language Courses',
    startCourse: 'Start lesson',
    continueTitle: 'Continue Learning!',
    continueDesc: 'You paused course',
    continueAt: 'at question',
    resumeBtn: 'Resume Lesson',
    dailyTitle: '🎁 Daily Reward',
    dailyDesc: 'Claim 200 free gems every 24h!',
    claimBtn: 'Claim 200 💎',
    claimedBtn: 'Claimed',
    shopTitle: '🛒 Equipment & Themes Shop',
    buy: 'Buy',
    use: 'Equip',
    active: 'Active',
    profileTitle: 'Account Settings',
    username: 'Username',
    email: 'Email Address',
    passChange: 'Password Security',
    oldPass: 'Current Password',
    newPass: 'New Password',
    repPass: 'Repeat New Password',
    saveBtn: 'Save Changes',
    noHearts: 'You ran out of hearts! Refill them in the shop.',
    lvl: 'Level',
    xpNeeded: 'Collect',
    xpToNext: 'more XP to reach the next level!',
    noAch: 'No achievements unlocked yet. Finish a quiz to get your first trophies!',
    rankXp: 'Experience Leaderboard (XP)',
    rankGems: 'Richest Players (Gems)',
    rankLang: 'Language Masters',
    completedLessons: 'Lessons completed:',
    youTag: '(You)',
    correctCountLabel: 'correct',
    accuracyLabel: 'accuracy',
    noRankData: 'No results for this language yet. Be the first to complete a lesson!',
    gemsTab: 'Gems',
    coursesTab: 'Courses',
    courses: {
      Angielski: 'English',
      Niemiecki: 'German',
      Hiszpański: 'Spanish',
      Włoski: 'Italian',
      Francuski: 'French',
      Polski: 'Polish'
    },
    shopItems: {
      1: { name: 'Restore Heart (+1 ❤️)', desc: 'Restores 1 heart immediately' },
      2: { name: 'Full Health (+5 ❤️)', desc: 'Completely restores your hearts (5/5)' },
      3: { name: 'XP Booster (+150 XP)', desc: 'Instantly adds 150 XP' },
      8: { name: 'Question Skip (Skip ⏩)', desc: 'Skip difficult questions during lessons' },
      7: { name: 'Powder Pink Theme 🌸', desc: 'Pearl white paired with subtle pastel pink' },
      5: { name: 'Ocean Blue Theme 🌊', desc: 'Deep ocean blues and cyan accents' },
      6: { name: 'Emerald Forest Theme 🌲', desc: 'Soothing emerald green nature theme' },
      4: { name: 'Royal Gold 👑', desc: 'Exclusive Premium Gold aesthetic' },
      9: { name: 'Cyberpunk Neon ⚡', desc: 'Futuristic violet with sharp neon glows' }
    },
    ach: {
      registration: { title: 'Welcome to LanguAI', desc: 'Joined the community.' },
      first_blood: { title: 'First Blood', desc: 'First correct answer.' },
      first_lesson: { title: 'First Bell', desc: 'Completed first lesson.' },
      xp_100: { title: 'Student', desc: 'Earn 100 XP.' },
      xp_500: { title: 'Scholar', desc: 'Earn 500 XP.' },
      xp_1000: { title: 'Expert', desc: 'Earn 1000 XP.' },
      xp_5000: { title: 'Master', desc: 'Earn 5000 XP.' },
      xp_10000: { title: 'Legend', desc: 'Earn 10000 XP.' },
      gems_50: { title: 'Collector', desc: 'Collect 50 gems.' },
      gems_200: { title: 'Banker', desc: 'Collect 200 gems.' },
      gems_1000: { title: 'Millionaire', desc: 'Collect 1000 gems.' },
      spender_1: { title: 'Customer', desc: 'Buy an item in the shop.' },
      spender_5: { title: 'Shopaholic', desc: 'Buy 5 items in the shop.' },
      answers_10: { title: 'Warm-up', desc: '10 correct answers.' },
      answers_50: { title: 'Brainiac', desc: '50 correct answers.' },
      answers_100: { title: 'Genius', desc: '100 correct answers.' },
      answers_500: { title: 'Omnibus', desc: '500 correct answers.' },
      lessons_5: { title: 'Diligent Student', desc: 'Complete 5 lessons.' },
      lessons_20: { title: 'Regular', desc: 'Complete 20 lessons.' },
      survivor: { title: 'Survivor', desc: 'Finish a lesson with 1 heart left.' }
    }
  },
  de: {
    learn: 'Lernen',
    shop: 'Laden',
    leaderboard: 'Bestenliste',
    achievements: 'Erfolge',
    settings: 'Einstellungen',
    coursesTitle: 'Verfügbare Sprachkurse',
    startCourse: 'Lektion starten',
    continueTitle: 'Weiterlernen!',
    continueDesc: 'Du hast den Kurs pausiert:',
    continueAt: 'bei Frage',
    resumeBtn: 'Fortsetzen',
    dailyTitle: '🎁 Tägliche Belohnung',
    dailyDesc: 'Erhalte alle 24h 200 Gratis-Edelsteine!',
    claimBtn: '200 💎 abholen',
    claimedBtn: 'Erhalten',
    shopTitle: '🛒 Ausrüstung & Themenladen',
    buy: 'Kaufen',
    use: 'Wählen',
    active: 'Aktiv',
    profileTitle: 'Kontoeinstellungen',
    username: 'Benutzername',
    email: 'E-Mail-Adresse',
    passChange: 'Passwortsicherheit',
    oldPass: 'Aktuelles Passwort',
    newPass: 'Neues Passwort',
    repPass: 'Passwort wiederholen',
    saveBtn: 'Speichern',
    noHearts: 'Keine Herzen mehr! Kaufe sie im Laden.',
    lvl: 'Stufe',
    xpNeeded: 'Sammle noch',
    xpToNext: 'XP, um das nächste Level zu erreichen!',
    noAch: 'Noch keine Erfolge freigeschaltet. Schließe ein Quiz ab!',
    rankXp: 'XP Rangliste',
    rankGems: 'Reichste Spieler',
    rankLang: 'Sprachmeister',
    completedLessons: 'Abgeschlossene Lektionen:',
    youTag: '(Du)',
    correctCountLabel: 'richtig',
    accuracyLabel: 'Genauigkeit',
    noRankData: 'Noch keine Ergebnisse für diese Sprache. Sei der Erste!',
    gemsTab: 'Edelsteine',
    coursesTab: 'Kurse',
    courses: {
      Angielski: 'Englisch',
      Niemiecki: 'Deutsch',
      Hiszpański: 'Spanisch',
      Włoski: 'Italienisch',
      Francuski: 'Französisch',
      Polski: 'Polnisch'
    },
    shopItems: {
      1: { name: 'Herz erneuern (+1 ❤️)', desc: 'Stellt sofort 1 Lebenspunkt wieder her' },
      2: { name: 'Volle Gesundheit (+5 ❤️)', desc: 'Füllt alle Herzen komplett auf' },
      3: { name: 'XP-Booster (+150 XP)', desc: 'Sofortige Erfahrungspunkte' },
      8: { name: 'Frage überspringen (Skip ⏩)', desc: 'Erlaubt schwierige Fragen zu überspringen' },
      7: { name: 'Puderrosa Thema 🌸', desc: 'Perlweiß und pudriges Pastellrosa' },
      5: { name: 'Ozeanblau Thema 🌊', desc: 'Tiefes Meeresblau und Cyan' },
      6: { name: 'Smaragdwald Thema 🌲', desc: 'Entspannendes Smaragdgrün' },
      4: { name: 'Königliches Gold 👑', desc: 'Exklusives Premium-Gold-Thema' },
      9: { name: 'Cyberpunk Neon ⚡', desc: 'Futuristisches Neon-Lila' }
    },
    ach: {
      registration: { title: 'Willkommen bei LanguAI', desc: 'Der Community beigetreten.' },
      first_blood: { title: 'Erstes Blut', desc: 'Erste richtige Antwort.' },
      first_lesson: { title: 'Erste Lektion', desc: 'Erste Lektion abgeschlossen.' },
      xp_100: { title: 'Schüler', desc: '100 XP erreichen.' },
      xp_500: { title: 'Student', desc: '500 XP erreichen.' },
      xp_1000: { title: 'Experte', desc: '1000 XP erreichen.' },
      xp_5000: { title: 'Meister', desc: '5000 XP erreichen.' },
      xp_10000: { title: 'Legende', desc: '10000 XP erreichen.' },
      gems_50: { title: 'Sammler', desc: '50 Edelsteine sammeln.' },
      gems_200: { title: 'Bankier', desc: '200 Edelsteine sammeln.' },
      gems_1000: { title: 'Millionär', desc: '1000 Edelsteine sammeln.' },
      spender_1: { title: 'Kunde', desc: 'Gegenstand im Laden kaufen.' },
      spender_5: { title: 'Shoppen', desc: '5 Gegenstände kaufen.' },
      answers_10: { title: 'Aufwärmen', desc: '10 richtige Antworten.' },
      answers_50: { title: 'Denker', desc: '50 richtige Antworten.' },
      answers_100: { title: 'Genie', desc: '100 richtige Antworten.' },
      answers_500: { title: 'Allwissend', desc: '500 richtige Antworten.' },
      lessons_5: { title: 'Fleißig', desc: '5 Lektionen abschließen.' },
      lessons_20: { title: 'Stammgast', desc: '20 Lektionen abschließen.' },
      survivor: { title: 'Überlebender', desc: 'Lektion mit 1 Herz beendet.' }
    }
  },
  ru: {
    learn: 'Обучение',
    shop: 'Магазин',
    leaderboard: 'Рейтинг',
    achievements: 'Достижения',
    settings: 'Настройки',
    coursesTitle: 'Доступные языковые курсы',
    startCourse: 'Начать урок',
    continueTitle: 'Продолжить обучение!',
    continueDesc: 'Вы остановились в курсе',
    continueAt: 'на вопросе',
    resumeBtn: 'Возобновить',
    dailyTitle: '🎁 Ежедневный бонус',
    dailyDesc: 'Получите 200 бесплатных кристаллов каждые 24ч!',
    claimBtn: 'Забрать 200 💎',
    claimedBtn: 'Получено',
    shopTitle: '🛒 Магазин предметов и тем',
    buy: 'Купить',
    use: 'Выбрать',
    active: 'Активно',
    profileTitle: 'Настройки аккаунта',
    username: 'Имя пользователя',
    email: 'Адрес Email',
    passChange: 'Смена пароля',
    oldPass: 'Текущий пароль',
    newPass: 'Новый пароль',
    repPass: 'Повторите новый пароль',
    saveBtn: 'Сохранить изменения',
    noHearts: 'Закончились жизни! Пополните их в магазине.',
    lvl: 'Уровень',
    xpNeeded: 'Соберите еще',
    xpToNext: 'XP для повышения уровня!',
    noAch: 'Нет открытых достижений. Пройдите квиз, чтобы получить первые кубки!',
    rankXp: 'Рейтинг Опыта (XP)',
    rankGems: 'Богатейшие (Кристаллы)',
    rankLang: 'Мастера Языков',
    completedLessons: 'Пройдено уроков:',
    youTag: '(Вы)',
    correctCountLabel: 'верных',
    accuracyLabel: 'точности',
    noRankData: 'Пока нет результатов для этого языка. Будьте первым!',
    gemsTab: 'Кристаллы',
    coursesTab: 'Курсы',
    courses: {
      Angielski: 'Английский',
      Niemiecki: 'Немецкий',
      Hiszpański: 'Испанский',
      Włoski: 'Итальянский',
      Francuski: 'Французский',
      Polski: 'Польский'
    },
    shopItems: {
      1: { name: 'Восстановить Сердце (+1 ❤️)', desc: 'Восстанавливает 1 жизнь мгновенно' },
      2: { name: 'Полное Здоровье (+5 ❤️)', desc: 'Полное восстановление всех сердец' },
      3: { name: 'Бустер XP (+150 XP)', desc: 'Быстрый прирост очков опыта' },
      8: { name: 'Пропуск Вопроса (Skip ⏩)', desc: 'Позволяет пропустить сложный вопрос' },
      7: { name: 'Пудрово-розовая тема 🌸', desc: 'Жемчужно-белый с нежным розовым' },
      5: { name: 'Океанская тема 🌊', desc: 'Глубокий синий и бирюзовые тона' },
      6: { name: 'Изумрудный Лес 🌲', desc: 'Успокаивающий зеленый стиль природы' },
      4: { name: 'Королевское Золото 👑', desc: 'Эксклюзивная золотая тема Premium' },
      9: { name: 'Киберпанк Неон ⚡', desc: 'Футуристический фиолетовый с неоном' }
    },
    ach: {
      registration: { title: 'Добро пожаловать', desc: 'Вы присоединились к LanguAI.' },
      first_blood: { title: 'Первая кровь', desc: 'Первый верный ответ.' },
      first_lesson: { title: 'Первый звонок', desc: 'Первый завершенный урок.' },
      xp_100: { title: 'Ученик', desc: 'Наберите 100 XP.' },
      xp_500: { title: 'Студент', desc: 'Наберите 500 XP.' },
      xp_1000: { title: 'Эксперт', desc: 'Наберите 1000 XP.' },
      xp_5000: { title: 'Мастер', desc: 'Наберите 5000 XP.' },
      xp_10000: { title: 'Легенда', desc: 'Наберите 10000 XP.' },
      gems_50: { title: 'Собиратель', desc: 'Соберите 50 кристаллов.' },
      gems_200: { title: 'Banker', desc: '200 кристаллов.' },
      gems_1000: { title: 'Миллионер', desc: '1000 кристаллов.' },
      spender_1: { title: 'Покупатель', desc: 'Купите товар.' },
      spender_5: { title: 'Шопоголик', desc: 'Купите 5 предметов.' },
      answers_10: { title: 'Разминка', desc: '10 правильных ответов.' },
      answers_50: { title: 'Умник', desc: '50 правильных ответов.' },
      answers_100: { title: 'Гений', desc: '100 правильных ответов.' },
      answers_500: { title: 'Эрудит', desc: '500 правильных ответов.' },
      lessons_5: { title: 'Прилежный ученик', desc: '5 уроков.' },
      lessons_20: { title: 'Постоянный гость', desc: '20 уроков.' },
      survivor: { title: 'Выживший', desc: '1 сердце в конце урока.' }
    }
  }
}

const THEME_CONFIG: Record<string, {
  bg: string
  primaryBtn: string
  accentText: string
  accentBadge: string
  cardBorder: string
  textColor: string
}> = {
  powder_pink: {
    bg: 'from-[#fff5f8] via-[#ffe8f0] to-[#ffd1dc]',
    primaryBtn: 'from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-slate-900 shadow-pink-300/50',
    accentText: 'text-pink-600',
    accentBadge: 'bg-pink-100 text-pink-700 border-pink-300',
    cardBorder: 'border-pink-200/80 bg-white/70 backdrop-blur-xl shadow-pink-100/50',
    textColor: 'text-slate-800'
  },
  green: {
    bg: 'from-[#021b10] via-[#04331e] to-[#0a5231]',
    primaryBtn: 'from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-emerald-600/30',
    accentText: 'text-emerald-400',
    accentBadge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    cardBorder: 'border-emerald-500/20 bg-black/40',
    textColor: 'text-slate-100'
  },
  blue: {
    bg: 'from-[#031525] via-[#05325c] to-[#005288]',
    primaryBtn: 'from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-600/30',
    accentText: 'text-cyan-400',
    accentBadge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    cardBorder: 'border-cyan-500/20 bg-black/40',
    textColor: 'text-slate-100'
  },
  gold: {
    bg: 'from-[#191102] via-[#3d2906] to-[#6b4708]',
    primaryBtn: 'from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-amber-500/30 font-black',
    accentText: 'text-amber-300',
    accentBadge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    cardBorder: 'border-amber-500/20 bg-black/40',
    textColor: 'text-slate-100'
  },
  cyberpunk: {
    bg: 'from-[#1a002c] via-[#38004f] to-[#050014]',
    primaryBtn: 'from-fuchsia-600 to-cyan-500 hover:from-fuchsia-500 hover:to-cyan-400 text-white shadow-fuchsia-600/40',
    accentText: 'text-fuchsia-400',
    accentBadge: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
    cardBorder: 'border-fuchsia-500/25 bg-black/50',
    textColor: 'text-slate-100'
  },
  default: {
    bg: 'from-[#1d0633] via-[#3d0f5a] to-[#d500f9]',
    primaryBtn: 'from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-pink-600/30',
    accentText: 'text-pink-400',
    accentBadge: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
    cardBorder: 'border-white/10 bg-black/40',
    textColor: 'text-slate-100'
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [tab, setTab] = useState<'learn' | 'shop' | 'leaderboard' | 'achievements' | 'settings'>('learn')
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeLang, setActiveLang] = useState<'pl' | 'en' | 'de' | 'ru'>('pl')
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [timeLeft, setTimeLeft] = useState<string | null>(null)
  const [canClaim, setCanClaim] = useState(false)
  const [shopModal, setShopModal] = useState<{ title: string; desc: string; ok: boolean } | null>(null)
  const [leaderboardData, setLeaderboardData] = useState<{ topXp: any[]; topGems: any[]; progress: any[] } | null>(null)
  const [rankTab, setRankTab] = useState<'xp' | 'gems' | 'lang'>('xp')
  const [selectedRankLang, setSelectedRankLang] = useState<string>('Angielski')
  const router = useRouter()

  useEffect(() => {
    getSessionUser().then((data) => {
      setUser(data)
      if (['pl', 'en', 'de', 'ru'].includes(data.interfaceLanguage || '')) {
        setActiveLang(data.interfaceLanguage as any)
      }
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (tab === 'leaderboard' && !leaderboardData) {
      getLeaderboardData().then(setLeaderboardData)
    }
  }, [tab, leaderboardData])

  useEffect(() => {
    if (!user) return
    function checkTimer() {
      const last = user?.lastDailyClaim ? new Date(user.lastDailyClaim).getTime() : 0
      const now = Date.now()
      const diff = 86400000 - (now - last)

      if (diff <= 0 || !user?.lastDailyClaim) {
        setCanClaim(true)
        setTimeLeft(null)
      } else {
        setCanClaim(false)
        const h = Math.floor(diff / 3600000)
        const m = Math.floor((diff % 3600000) / 60000)
        const s = Math.floor((diff % 60000) / 1000)
        setTimeLeft(`${h}h ${m}m ${s}s`)
      }
    }
    checkTimer()
    const interval = setInterval(checkTimer, 1000)
    return () => clearInterval(interval)
  }, [user])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-pink-400 font-bold text-lg animate-pulse">
        <Sparkles className="w-8 h-8 animate-spin" />
        Ładowanie LanguAI...
      </div>
    )
  }

  const t = T[activeLang] || T.pl
  const xp = user.xp ?? 0
  const level = Math.floor(xp / 300) + 1
  const xpInLevel = xp % 300
  const xpProgress = (xpInLevel / 300) * 100

  const themeCode = user.theme || 'default'
  const theme = THEME_CONFIG[themeCode] || THEME_CONFIG.default

  let unlockedThemes: string[] = ['default']
  try {
    unlockedThemes = JSON.parse(user.unlockedThemes || '["default"]')
  } catch (e) {
    unlockedThemes = ['default']
  }

  const hasActiveSession = Boolean(
    user.savedQuizLang && 
    typeof user.savedQuizProgress === 'number' && 
    user.savedQuizProgress > 0 && 
    user.savedQuizProgress < 20
  )

  async function handleLanguageChange(code: 'pl' | 'en' | 'de' | 'ru') {
    setActiveLang(code)
    await setAppLanguage(code)
  }

  async function handleProfileUpdate(formData: FormData) {
    setMsg(null)
    const res = await updateUserProfile(formData)
    setMsg({ text: res.message || res.error || '', ok: !!res.success })
    if (res.success) {
      setTimeout(() => window.location.reload(), 1200)
    }
  }

  async function handleBuy(id: number, cost: number) {
    const res = await buyShopItem(id, cost)
    setShopModal({
      title: res.success ? 'Zakup udany!' : 'Uwaga',
      desc: res.message || res.error || '',
      ok: !!res.success
    })
    if (res.success) {
      const u = await getSessionUser()
      setUser(u)
    }
  }

  async function handleEquip(themeName: string) {
    const res = await equipTheme(themeName)
    setShopModal({
      title: res.success ? 'Motyw aktywowany' : 'Błąd',
      desc: res.message || res.error || '',
      ok: !!res.success
    })
    if (res.success) {
      const u = await getSessionUser()
      setUser(u)
    }
  }

  async function handleDaily() {
    if (!canClaim) return
    const res = await claimDailyReward()
    setShopModal({
      title: res.success ? 'Nagroda odebrana!' : 'Uwaga',
      desc: res.message || res.error || '',
      ok: !!res.success
    })
    if (res.success) {
      const u = await getSessionUser()
      setUser(u)
    }
  }

  function handleLogout() {
    document.cookie = 'userId=; Max-Age=0; path=/;'
    router.push('/')
  }

  const courses = [
    { nameKey: 'Angielski', code: 'Angielski', flag: 'gb' },
    { nameKey: 'Niemiecki', code: 'Niemiecki', flag: 'de' },
    { nameKey: 'Hiszpański', code: 'Hiszpański', flag: 'es' },
    { nameKey: 'Włoski', code: 'Włoski', flag: 'it' },
    { nameKey: 'Francuski', code: 'Francuski', flag: 'fr' },
    { nameKey: 'Polski', code: 'Polski', flag: 'pl' },
  ] as const

  const flags = [
    { code: 'pl', name: 'Polski' },
    { code: 'en', name: 'English', flag: 'gb' },
    { code: 'de', name: 'Deutsch', flag: 'de' },
    { code: 'ru', name: 'Русский', flag: 'ru' },
  ]

  const shopItemsData = [
    { id: 1, cost: 50, icon: '❤️', type: 'heart', isSingleHeart: true },
    { id: 2, cost: 200, icon: '💖', type: 'heart', isFullHeal: true },
    { id: 8, cost: 120, icon: '⏩', type: 'perk' },
    { id: 3, cost: 150, icon: '⚡', type: 'xp' },
    { id: 7, cost: 250, icon: '🌸', type: 'theme', themeCode: 'powder_pink' },
    { id: 5, cost: 300, icon: '🌊', type: 'theme', themeCode: 'blue' },
    { id: 6, cost: 300, icon: '🌲', type: 'theme', themeCode: 'green' },
    { id: 9, cost: 400, icon: '⚡', type: 'theme', themeCode: 'cyberpunk' },
    { id: 4, cost: 1000, icon: '👑', type: 'theme', themeCode: 'gold' },
  ] as const

  return (
    <div className={`min-h-screen bg-linear-to-br ${theme.bg} ${theme.textColor} pb-16 transition-colors duration-500`}>
      {/* NAGŁÓWEK */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-black/40 border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white"
            aria-label="Otwórz menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">🌐</span>
            <span className={`font-black text-lg sm:text-xl tracking-tight bg-linear-to-r ${theme.primaryBtn} bg-clip-text text-transparent`}>
              LanguAI {user.theme === 'gold' && '👑'}
            </span>
          </div>
        </div>

        {/* Nawigacja Desktop */}
        <nav className="hidden md:flex gap-1 bg-black/50 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setTab('learn')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === 'learn' ? `bg-linear-to-r ${theme.primaryBtn} text-white shadow-lg` : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" /> {t.learn}
          </button>
          <button
            onClick={() => setTab('shop')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === 'shop' ? `bg-linear-to-r ${theme.primaryBtn} text-white shadow-lg` : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> {t.shop}
          </button>
          <button
            onClick={() => setTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === 'leaderboard' ? `bg-linear-to-r ${theme.primaryBtn} text-white shadow-lg` : 'text-slate-400 hover:text-white'
            }`}
          >
            <Medal className="w-4 h-4" /> {t.leaderboard}
          </button>
          <button
            onClick={() => setTab('achievements')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === 'achievements' ? `bg-linear-to-r ${theme.primaryBtn} text-white shadow-lg` : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" /> {t.achievements}
          </button>
          <button
            onClick={() => setTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === 'settings' ? `bg-linear-to-r ${theme.primaryBtn} text-white shadow-lg` : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" /> {t.settings}
          </button>
        </nav>

        {/* Prawy Panel */}
        <div className="flex items-center gap-2 sm:gap-3 font-bold text-sm">
          {/* Flagi widoczne TYLKO na ekranach md w górę (desktop/tablet) */}
          <div className="hidden md:flex items-center gap-1 bg-black/40 p-1 sm:p-1.5 rounded-xl border border-white/10">
            {flags.map((f) => (
              <button
                key={f.code}
                onClick={() => handleLanguageChange(f.code as any)}
                className={`relative w-5 h-3.5 sm:w-7 sm:h-5 rounded overflow-hidden transition-all ${
                  activeLang === f.code ? 'ring-2 ring-white scale-110 opacity-100' : 'opacity-40 hover:opacity-90'
                }`}
                title={f.name}
              >
                <img
                  src={`https://flagcdn.com/w40/${f.flag || f.code}.png`}
                  alt={f.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-black/40 px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/10 text-rose-400 text-xs sm:text-sm">
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-rose-500 text-rose-500" /> {user.hearts}
          </div>

          <div className="flex items-center gap-1 bg-black/40 px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/10 text-cyan-400 text-xs sm:text-sm">
            <Gem className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" /> {user.gems}
          </div>

          {/* Przycisk wylogowania na pasku widoczny TYLKO na desktopie */}
          <button
            onClick={handleLogout}
            title="Wyloguj się"
            className="hidden md:flex p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* MOBILE HAMBURGER MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80%] bg-slate-950/95 border-r border-white/10 p-6 flex flex-col justify-between z-10 shadow-2xl h-full overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className={`font-extrabold text-lg flex items-center gap-2 ${theme.accentText}`}>
                  <Sparkles className="w-5 h-5" /> LanguAI
                </span>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* SEKCJA ZMIANY JĘZYKA W MENU MOBILNYM */}
              <div className="mb-6 p-3 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[11px] uppercase tracking-wider font-extrabold opacity-60 mb-2.5">
                  Język aplikacji / Language
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {flags.map((f) => (
                    <button
                      key={f.code}
                      onClick={() => {
                        handleLanguageChange(f.code as any)
                        setMobileMenuOpen(false)
                      }}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        activeLang === f.code
                          ? `bg-linear-to-r ${theme.primaryBtn} text-white shadow-md border-transparent`
                          : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={`https://flagcdn.com/w40/${f.flag || f.code}.png`}
                        alt={f.name}
                        className="w-4 h-3 object-cover rounded-xs"
                      />
                      <span className="truncate">{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* LINKI GŁÓWNE */}
              <div className="space-y-2">
                {[
                  { id: 'learn', label: t.learn, icon: BookOpen },
                  { id: 'shop', label: t.shop, icon: ShoppingBag },
                  { id: 'leaderboard', label: t.leaderboard, icon: Medal },
                  { id: 'achievements', label: t.achievements, icon: Trophy },
                  { id: 'settings', label: t.settings, icon: Settings },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setTab(item.id as any)
                        setMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                        tab === item.id
                          ? `bg-linear-to-r ${theme.primaryBtn} text-white shadow-lg`
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" /> {item.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* PRZYCISK WYLOGUJ NA SAMYM DOLE HAMBURGERA */}
            <div className="pt-6 mt-6 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 font-bold text-sm transition-colors"
              >
                <LogOut className="w-5 h-5" /> Wyloguj się
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ZAWARTOŚĆ GŁÓWNA */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        {/* ZAKŁADKA NAUKA */}
        {tab === 'learn' && (
          <div className="space-y-6">
            {hasActiveSession && (
              <div className={`border rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl ${theme.cardBorder}`}>
                <div>
                  <h3 className="text-xl font-black flex items-center gap-2">
                    <PlayCircle className={`w-6 h-6 ${theme.accentText}`} /> {t.continueTitle}
                  </h3>
                  <p className="text-sm opacity-80 mt-1">
                    {t.continueDesc} <strong className={theme.accentText}>{(t.courses as any)[user.savedQuizLang] || user.savedQuizLang}</strong> {t.continueAt} <strong>{user.savedQuizProgress + 1}/20</strong>.
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/learn?lang=${user.savedQuizLang}`)}
                  className={`px-6 py-3 rounded-xl bg-linear-to-r ${theme.primaryBtn} font-black text-sm shadow-xl active:scale-95 transition-all whitespace-nowrap`}
                >
                  {t.resumeBtn} ▶
                </button>
              </div>
            )}

            <div className={`border rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden ${theme.cardBorder}`}>
              <span className={`inline-block text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border mb-3 ${theme.accentBadge}`}>
                {t.lvl} {level}
              </span>
              <div className={`text-4xl sm:text-5xl font-black mb-2 ${theme.accentText}`}>
                ✨ {xpInLevel} / 300 XP
              </div>
              <p className="opacity-80 text-sm">
                {t.xpNeeded} <strong className={theme.accentText}>{300 - xpInLevel}</strong> {t.xpToNext}
              </p>
              <div className="w-full bg-black/40 h-3.5 rounded-full mt-6 overflow-hidden border border-white/10 p-0.5">
                <div
                  className={`bg-linear-to-r ${theme.primaryBtn} h-full rounded-full transition-all duration-700`}
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>

            <div className={`border rounded-3xl p-6 sm:p-8 shadow-2xl ${theme.cardBorder}`}>
              <h2 className={`text-xl font-black mb-6 flex items-center gap-2 ${theme.accentText}`}>
                <BookOpen className="w-6 h-6" /> {t.coursesTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.map((c) => (
                  <div
                    key={c.code}
                    onClick={() => {
                      if (user.hearts <= 0) {
                        setShopModal({
                          title: 'Brak serc',
                          desc: t.noHearts,
                          ok: false
                        })
                        setTab('shop')
                      } else {
                        router.push(`/learn?lang=${c.code}`)
                      }
                    }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-black/30 border border-white/10 hover:border-white/30 hover:scale-[1.01] cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 rounded-lg overflow-hidden border border-white/20 shadow-md">
                        <img
                          src={`https://flagcdn.com/w80/${c.flag}.png`}
                          alt={c.nameKey}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-bold text-base transition-colors">
                        {t.courses[c.nameKey] || c.nameKey}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-extrabold px-3 py-1.5 rounded-xl border ${theme.accentBadge}`}>
                      {t.startCourse} <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ZAKŁADKA SKLEP */}
        {tab === 'shop' && (
          <div className="space-y-6">
            <div className={`border rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl ${theme.cardBorder}`}>
              <div>
                <h3 className="text-xl font-black flex items-center gap-2 text-amber-300">
                  <Sparkles className="w-6 h-6" /> {t.dailyTitle}
                </h3>
                <p className="text-sm opacity-80">{t.dailyDesc}</p>
              </div>

              {canClaim ? (
                <button
                  onClick={handleDaily}
                  className="px-6 py-3.5 rounded-xl bg-linear-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all whitespace-nowrap"
                >
                  {t.claimBtn}
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-black/50 border border-white/10 px-5 py-3 rounded-2xl">
                  <span className="text-xs font-black uppercase opacity-60 tracking-wider">
                    {t.claimedBtn}
                  </span>
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                    <Clock className="w-4 h-4" />
                    <span>{timeLeft}</span>
                  </div>
                </div>
              )}
            </div>

            <div className={`border rounded-3xl p-6 sm:p-8 shadow-2xl ${theme.cardBorder}`}>
              <h2 className={`text-xl font-black mb-6 flex items-center gap-2 ${theme.accentText}`}>
                <ShoppingBag className="w-6 h-6" /> {t.shopTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {shopItemsData.map((item: any) => {
                  const translatedItem = (t.shopItems as any)[item.id] || { name: `Przedmiot ${item.id}`, desc: '' }
                  const isThemeItem = item.type === 'theme'
                  const isThemeUnlocked = isThemeItem && unlockedThemes.includes(item.themeCode)
                  const isThemeActive = isThemeItem && user.theme === item.themeCode
                  const isFullHearts = (user.hearts ?? 5) >= 5

                  return (
                    <div key={item.id} className="bg-black/30 border border-white/10 hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between transition-all">
                      <div>
                        <div className="text-4xl mb-2 text-center">{item.icon}</div>
                        <h4 className="font-bold text-sm text-center mb-1">{translatedItem.name}</h4>
                        <p className="text-xs opacity-70 text-center mb-3">{translatedItem.desc}</p>
                      </div>

                      <div>
                        {!isThemeUnlocked && (
                          <div className="flex items-center justify-center gap-1 text-cyan-400 font-extrabold text-sm mb-3">
                            <Gem className="w-4 h-4" /> {item.cost}
                          </div>
                        )}

                        {isThemeItem ? (
                          isThemeActive ? (
                            <button
                              disabled
                              className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-1 cursor-default"
                            >
                              <Check className="w-4 h-4" /> {t.active}
                            </button>
                          ) : isThemeUnlocked ? (
                            <button
                              onClick={() => handleEquip(item.themeCode)}
                              className={`w-full py-2.5 rounded-xl bg-linear-to-r ${theme.primaryBtn} font-bold text-xs shadow-md transition-all active:scale-95`}
                            >
                              {t.use}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBuy(item.id, item.cost)}
                              className={`w-full py-2.5 rounded-xl bg-linear-to-r ${theme.primaryBtn} font-bold text-xs shadow-md transition-all active:scale-95`}
                            >
                              {t.buy}
                            </button>
                          )
                        ) : (
                          <button
                            disabled={item.isFullHeal && isFullHearts}
                            onClick={() => handleBuy(item.id, item.cost)}
                            className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 ${
                              item.isFullHeal && isFullHearts
                                ? 'bg-black/50 border border-white/10 text-slate-500 cursor-not-allowed'
                                : `bg-linear-to-r ${theme.primaryBtn}`
                            }`}
                          >
                            {item.isFullHeal && isFullHearts ? 'Pełne serca (5/5)' : t.buy}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ZAKŁADKA RANKING (LEADERBOARD) */}
        {tab === 'leaderboard' && (
          <div className={`border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 ${theme.cardBorder}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className={`text-xl font-black flex items-center gap-2 ${theme.accentText}`}>
                <Medal className="w-6 h-6" /> {t.leaderboard}
              </h2>

              <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-bold">
                <button
                  onClick={() => setRankTab('xp')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    rankTab === 'xp' ? `bg-linear-to-r ${theme.primaryBtn} text-white` : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  ⚡ XP
                </button>
                <button
                  onClick={() => setRankTab('gems')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    rankTab === 'gems' ? `bg-linear-to-r ${theme.primaryBtn} text-white` : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  💎 {t.gemsTab}
                </button>
                <button
                  onClick={() => setRankTab('lang')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    rankTab === 'lang' ? `bg-linear-to-r ${theme.primaryBtn} text-white` : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  🌐 {t.coursesTab}
                </button>
              </div>
            </div>

            {!leaderboardData ? (
              <p className="text-center py-8 opacity-60 animate-pulse">Pobieranie rankingu...</p>
            ) : (
              <div className="space-y-3">
                {rankTab === 'xp' && (
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider font-bold opacity-60 mb-2">{t.rankXp}</p>
                    {leaderboardData.topXp.map((player, idx) => {
                      const isMe = player.id === user.id
                      return (
                        <div
                          key={player.id}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                            isMe ? 'bg-white/15 border-white/40 font-black' : 'bg-black/25 border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 text-center font-black text-sm opacity-80">
                              {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                            </span>
                            <span className="text-sm">{player.username} {isMe && t.youTag}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold">
                            <span className="opacity-70">{t.completedLessons} {player.lessonsCompleted ?? 0}</span>
                            <span className={`px-2.5 py-1 rounded-lg border ${theme.accentBadge}`}>
                              {player.xp} XP
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {rankTab === 'gems' && (
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider font-bold opacity-60 mb-2">{t.rankGems}</p>
                    {leaderboardData.topGems.map((player, idx) => {
                      const isMe = player.id === user.id
                      return (
                        <div
                          key={player.id}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                            isMe ? 'bg-white/15 border-white/40 font-black' : 'bg-black/25 border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 text-center font-black text-sm opacity-80">
                              {idx === 0 ? '👑' : idx === 1 ? '💎' : `#${idx + 1}`}
                            </span>
                            <span className="text-sm">{player.username} {isMe && t.youTag}</span>
                          </div>
                          <span className="text-cyan-400 font-black text-sm flex items-center gap-1">
                            <Gem className="w-4 h-4" /> {player.gems}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}

                {rankTab === 'lang' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-white/10">
                      {courses.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => setSelectedRankLang(c.code)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            selectedRankLang === c.code
                              ? `bg-linear-to-r ${theme.primaryBtn} text-white shadow-md`
                              : 'bg-black/30 border border-white/10 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={`https://flagcdn.com/w40/${c.flag}.png`}
                            alt={c.nameKey}
                            className="w-4 h-3 object-cover rounded-xs"
                          />
                          <span>{t.courses[c.nameKey] || c.nameKey}</span>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      {(() => {
                        const filtered = (leaderboardData.progress || [])
                          .filter((p) => p.targetLanguage === selectedRankLang)
                          .sort((a, b) => (b.correctCount ?? 0) - (a.correctCount ?? 0))

                        if (filtered.length === 0) {
                          return (
                            <p className="text-center py-6 text-xs opacity-60">
                              {t.noRankData}
                            </p>
                          )
                        }

                        return filtered.map((prog, idx) => {
                          const total = (prog.correctCount ?? 0) + (prog.wrongCount ?? 0)
                          const accuracy = total > 0 ? Math.round(((prog.correctCount ?? 0) / total) * 100) : 100
                          const isMe = prog.user?.username === user.username

                          return (
                            <div
                              key={prog.id}
                              className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                                isMe ? 'bg-white/15 border-white/40 font-black' : 'bg-black/25 border-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-6 text-center font-black text-sm">
                                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                                </span>
                                <span className="text-sm">{prog.user?.username} {isMe && t.youTag}</span>
                              </div>
                              <div className="flex items-center gap-3 text-xs font-bold">
                                <span className="opacity-70">{prog.correctCount} {t.correctCountLabel}</span>
                                <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                  {accuracy}% {t.accuracyLabel}
                                </span>
                              </div>
                            </div>
                          )
                        })
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ZAKŁADKA OSIĄGNIĘĆ */}
        {tab === 'achievements' && (
          <div className={`border rounded-3xl p-6 sm:p-8 shadow-2xl ${theme.cardBorder}`}>
            <h2 className={`text-xl font-black mb-6 flex items-center gap-2 ${theme.accentText}`}>
              <Trophy className="w-6 h-6" /> {t.achievements}
            </h2>
            {user.userAchievements.length === 0 ? (
              <p className="text-center py-8 opacity-60">{t.noAch}</p>
            ) : (
              <div className="space-y-3">
                {user.userAchievements.map((ua: any) => {
                  const key = ua.achievement.keyName
                  const trAch = (t.ach as any)[key] || {
                    title: ua.achievement.titlePl || key,
                    desc: ua.achievement.descPl || ''
                  }
                  return (
                    <div key={ua.id} className="flex items-center justify-between p-4 rounded-2xl bg-black/25 border border-white/10">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{ua.achievement.icon}</span>
                        <div>
                          <h4 className="font-bold text-sm">{trAch.title}</h4>
                          <p className="text-xs opacity-70">{trAch.desc}</p>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                        +{ua.achievement.xpReward} XP
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ZAKŁADKA USTAWIEŃ */}
        {tab === 'settings' && (
          <div className={`border rounded-3xl p-6 sm:p-8 shadow-2xl ${theme.cardBorder}`}>
            <h2 className={`text-xl font-black mb-6 flex items-center gap-2 ${theme.accentText}`}>
              <Settings className="w-6 h-6" /> {t.profileTitle}
            </h2>

            {msg && (
              <div className={`p-4 rounded-2xl mb-6 text-sm font-semibold border ${
                msg.ok ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
              }`}>
                {msg.text}
              </div>
            )}

            <form action={handleProfileUpdate} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold opacity-80 mb-1.5 uppercase tracking-wider">
                    {t.username}
                  </label>
                  <input
                    type="text"
                    name="username"
                    defaultValue={user.username}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold opacity-80 mb-1.5 uppercase tracking-wider">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={user.email}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${theme.accentText}`}>
                  <Lock className="w-4 h-4" /> {t.passChange}
                </h3>
                <div className="space-y-3">
                  <input
                    type="password"
                    name="old_pass"
                    placeholder={t.oldPass}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm focus:outline-none"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="password"
                      name="new_pass"
                      placeholder={t.newPass}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm focus:outline-none"
                    />
                    <input
                      type="password"
                      name="rep_pass"
                      placeholder={t.repPass}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 rounded-xl bg-linear-to-r ${theme.primaryBtn} font-extrabold text-sm shadow-xl transition-all active:scale-[0.98]`}
              >
                {t.saveBtn}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* DEDYKOWANY SZKLANY MODAL SKLEPU */}
      {shopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShopModal(null)} />
          <div className="relative w-full max-w-sm bg-slate-950/95 border border-white/15 rounded-3xl p-6 z-10 shadow-2xl text-center space-y-4">
            <div className="text-4xl">
              {shopModal.ok ? '✨' : '⚠️'}
            </div>
            <h3 className="text-lg font-black text-white">{shopModal.title}</h3>
            <p className="text-slate-300 text-sm">{shopModal.desc}</p>
            <button
              onClick={() => setShopModal(null)}
              className={`w-full py-2.5 rounded-xl bg-linear-to-r ${theme.primaryBtn} font-bold text-xs shadow-lg active:scale-95 transition-all`}
            >
              Rozumiem
            </button>
          </div>
        </div>
      )}
    </div>
  )
}