import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { name, email, password } = req.body

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER', 
      },
    })

    res.status(201).json({ message: 'Inscription réussie' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
}