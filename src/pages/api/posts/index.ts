import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { authOptions, getAuthOptions } from '../auth/[...nextauth]'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res,  getAuthOptions())
  console.log(session);
  if (!session) {
    return res.status(401).json({ message: 'Non autorisé' })
  }

  if (req.method === 'GET') {
    try {
      let posts
      if (session.user.role === 'ADMIN') {
        posts = await prisma.post.findMany({
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        })
      } else {
        posts = await prisma.post.findMany({
          where: { authorId: session.user.id },
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        })
      }

      res.status(200).json(posts)
    } catch (error) {
      console.error('Error fetching posts:', error)
      res.status(500).json({ message: 'Erreur serveur' })
    }
  } else if (req.method === 'POST') {
    const { title, content, thumbnail } = req.body

    try {
      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          thumbnail,
          authorId: session.user.id,
        },
        include: { author: { select: { name: true } } },
      })

      res.status(201).json(newPost)
    } catch (error) {
      console.error('Error creating post:', error)
      res.status(500).json({ message: 'Erreur lors de la création du post' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
