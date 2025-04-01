import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string
  thumbnail?: string
  author: {
    name: string
  }
  createdAt: string
}

export default function PostDetail() {
  const router = useRouter()
  const { id } = router.query
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`)
        if (!response.ok) {
          throw new Error('Post non trouvé')
        }
        const data = await response.json()
        setPost(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  if (loading) {
    return <div className="p-4">Chargement...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (!post) {
    return <div className="p-4">Post non trouvé</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/dashboard">
        <a className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
          &larr; Retour au tableau de bord
        </a>
      </Link>

      {post.thumbnail && (
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="flex items-center text-gray-500 mb-6">
        <span>Par {post.author.name}</span>
        <span className="mx-2">•</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="prose max-w-none">
        <p className="whitespace-pre-line">{post.content}</p>
      </div>
    </div>
  )
}