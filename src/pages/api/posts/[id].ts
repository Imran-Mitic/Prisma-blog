import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  const { id } = req.query

  if (!session) {
    return res.status(401).json({ message: 'Non autorisé' })
  }

  if (req.method === 'GET') {
    try {
      const post = await prisma.post.findUnique({
        where: { id: id as string },
        include: { author: { select: { name: true } } },
      })

      if (!post) {
        return res.status(404).json({ message: 'Post non trouvé' })
      }

      if (session.user.role !== 'ADMIN' && post.authorId !== session.user.id) {
        return res.status(403).json({ message: 'Accès non autorisé' })
      }

      res.status(200).json(post)
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur' })
    }
  } else if (req.method === 'PUT') {

    const { title, content, thumbnail } = req.body

    try {
      const existingPost = await prisma.post.findUnique({
        where: { id: id as string },
      })

      if (!existingPost) {
        return res.status(404).json({ message: 'Post non trouvé' })
      }

      if (session.user.role !== 'ADMIN' && existingPost.authorId !== session.user.id) {
        return res.status(403).json({ message: 'Accès non autorisé' })
      }

      const updatedPost = await prisma.post.update({
        where: { id: id as string },
        data: { title, content, thumbnail },
        include: { author: { select: { name: true } } },
      })

      res.status(200).json(updatedPost)
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const existingPost = await prisma.post.findUnique({
        where: { id: id as string },
      })

      if (!existingPost) {
        return res.status(404).json({ message: 'Post non trouvé' })
      }

      if (session.user.role !== 'ADMIN' && existingPost.authorId !== session.user.id) {
        return res.status(403).json({ message: 'Accès non autorisé' })
      }

      await prisma.post.delete({ where: { id: id as string } })
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}