import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export const authenticate = (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: 'Non authentifié' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    req.user = decoded
    return handler(req, res)
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' })
  }
}

export const authorize = (roles: string[]) => (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Non autorisé' })
  }
  return handler(req, res)
}