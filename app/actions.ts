'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function handleLogin(formData: FormData) {
  const email = formData.get('e') as string
  const password = formData.get('p') as string

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: 'Błędny email lub hasło!' }
  }

  // Zapisujemy sesję w ciasteczku (zastępuje $_SESSION)
  (await cookies()).set('userId', user.id.toString(), {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7, // 7 dni
  path: '/',
})

  redirect('/dashboard')
}

export async function handleRegister(formData: FormData) {
  const username = formData.get('u') as string
  const email = formData.get('e') as string
  const password = formData.get('p') as string
  const repeatPassword = formData.get('rp') as string

  if (password !== repeatPassword) {
    return { error: 'Hasła muszą być identyczne!' }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const avatars = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🦄']
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)]

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        avatar: randomAvatar,
      },
    })

    return { success: 'Konto założone pomyślnie! Zaloguj się.' }
  } catch (e) {
    return { error: 'Ten email jest już zajęty!' }
  }
}