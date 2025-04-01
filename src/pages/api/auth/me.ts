import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: 'Non authentifié' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true },
    })

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' })
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' })
  }
}