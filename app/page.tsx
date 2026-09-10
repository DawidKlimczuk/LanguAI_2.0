'use client'

import { useState } from 'react'
import { handleLogin, handleRegister } from './actions'

// Tłumaczenia ekranu autoryzacji
const T = {
  pl: {
    tagline: 'Inteligentna nauka języków obcych',
    loginTab: 'Logowanie',
    regTab: 'Rejestracja',
    emailLabel: 'Adres Email',
    emailPh: 'twoj@email.com',
    passLabel: 'Hasło',
    repPassLabel: 'Powtórz Hasło',
    userLabel: 'Nazwa użytkownika',
    userPh: 'Twój Nick',
    loginBtn: 'Zaloguj się',
    loggingIn: 'Logowanie...',
    regBtn: 'Utwórz konto',
    registering: 'Rejestracja...',
  },
  en: {
    tagline: 'AI-Powered Language Learning Platform',
    loginTab: 'Log In',
    regTab: 'Sign Up',
    emailLabel: 'Email Address',
    emailPh: 'your@email.com',
    passLabel: 'Password',
    repPassLabel: 'Repeat Password',
    userLabel: 'Username',
    userPh: 'Your Nickname',
    loginBtn: 'Sign In',
    loggingIn: 'Signing in...',
    regBtn: 'Create Account',
    registering: 'Creating account...',
  },
  de: {
    tagline: 'Intelligente Sprachlernplattform mit KI',
    loginTab: 'Anmelden',
    regTab: 'Registrieren',
    emailLabel: 'E-Mail-Adresse',
    emailPh: 'deine@email.de',
    passLabel: 'Passwort',
    repPassLabel: 'Passwort wiederholen',
    userLabel: 'Benutzername',
    userPh: 'Dein Nickname',
    loginBtn: 'Anmelden',
    loggingIn: 'Anmeldung...',
    regBtn: 'Konto erstellen',
    registering: 'Wird erstellt...',
  },
  ru: {
    tagline: 'Изучение языков с искусственным интеллектом',
    loginTab: 'Войти',
    regTab: 'Регистрация',
    emailLabel: 'Адрес Email',
    emailPh: 'tvoi@email.ru',
    passLabel: 'Пароль',
    repPassLabel: 'Повторите пароль',
    userLabel: 'Никнейм',
    userPh: 'Ваш ник',
    loginBtn: 'Войти',
    loggingIn: 'Вход...',
    regBtn: 'Создать аккаунт',
    registering: 'Создание...',
  }
}

export default function AuthPage() {
  const [tab, setTab] = useState<'log' | 'reg'>('log')
  const [lang, setLang] = useState<'pl' | 'en' | 'de' | 'ru'>('pl')
  const [showPass, setShowPass] = useState(false)
  const [showRepPass, setShowRepPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const t = T[lang]

  const flags = [
    { code: 'pl', flag: 'pl', name: 'Polski' },
    { code: 'en', flag: 'gb', name: 'English' },
    { code: 'de', flag: 'de', name: 'Deutsch' },
    { code: 'ru', flag: 'ru', name: 'Русский' }
  ]

  async function onLogin(formData: FormData) {
    setLoading(true)
    setMessage(null)
    const res = await handleLogin(formData)
    if (res?.error) {
      setMessage({ text: res.error, type: 'error' })
      setLoading(false)
    }
  }

  async function onRegister(formData: FormData) {
    setLoading(true)
    setMessage(null)
    const res = await handleRegister(formData)
    setLoading(false)
    if (res?.error) {
      setMessage({ text: res.error, type: 'error' })
    } else if (res?.success) {
      setMessage({ text: res.success, type: 'success' })
      setTab('log')
    }
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-gradient-to-br from-[#1d0633] via-[#3d0f5a] to-[#d500f9]">
      {/* Dynamiczne tło z neonowymi plamami świetlnymi */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

      {/* Wybór języka (Flagi w prawym górnym rogu) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-lg">
        {flags.map((f) => (
          <button
            key={f.code}
            type="button"
            onClick={() => setLang(f.code as any)}
            title={f.name}
            className={`w-7 h-5 rounded overflow-hidden transition-all ${
              lang === f.code ? 'ring-2 ring-pink-500 scale-110 opacity-100' : 'opacity-50 hover:opacity-100'
            }`}
          >
            <img
              src={`https://flagcdn.com/w80/${f.flag}.png`}
              alt={f.name}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-md my-auto">
        {/* Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 shadow-xl shadow-pink-500/30 mb-3 border border-white/20">
            <span className="text-3xl">🌐</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-pink-300 via-purple-200 to-white bg-clip-text text-transparent">
            LanguAI
          </h1>
          <p className="text-xs sm:text-sm text-pink-200/70 mt-1 font-medium">
            {t.tagline}
          </p>
        </div>

        {/* Komunikaty błędów / sukcesu */}
        {message && (
          <div
            className={`mb-5 p-4 rounded-2xl text-xs sm:text-sm font-semibold border transition-all ${
              message.type === 'success'
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Szklana karta */}
        <div className="backdrop-blur-2xl bg-black/40 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex bg-black/50 p-1.5 rounded-2xl mb-6 border border-white/5">
            <button
              type="button"
              onClick={() => { setTab('log'); setMessage(null); }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                tab === 'log'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.loginTab}
            </button>
            <button
              type="button"
              onClick={() => { setTab('reg'); setMessage(null); }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                tab === 'reg'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.regTab}
            </button>
          </div>

          {tab === 'log' ? (
            <form action={onLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  name="e"
                  required
                  placeholder={t.emailPh}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  {t.passLabel}
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="p"
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-sm pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {showPass ? '👁️' : '🔒'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 hover:from-pink-500 to-purple-600 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-pink-600/30 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? t.loggingIn : t.loginBtn}
              </button>
            </form>
          ) : (
            <form action={onRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  {t.userLabel}
                </label>
                <input
                  type="text"
                  name="u"
                  required
                  placeholder={t.userPh}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  name="e"
                  required
                  placeholder={t.emailPh}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  {t.passLabel}
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="p"
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-sm pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {showPass ? '👁️' : '🔒'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  {t.repPassLabel}
                </label>
                <div className="relative">
                  <input
                    type={showRepPass ? 'text' : 'password'}
                    name="rp"
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-sm pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRepPass(!showRepPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {showRepPass ? '👁️' : '🔒'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 hover:from-pink-500 to-purple-600 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-pink-600/30 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? t.registering : t.regBtn}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}