import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'LanguAI - Ucz się języków z AI',
  description: 'Nowoczesna platforma do nauki języków',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className={poppins.variable}>
      <body className="font-sans antialiased min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  )
}