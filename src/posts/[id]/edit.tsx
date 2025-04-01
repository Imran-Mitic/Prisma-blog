import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string
  thumbnail?: string
}

export default function EditPost() {
  const router = useRouter()
  const { id } = router.query
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!post) return

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      router.push(`/posts/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

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
      <Link href={`/posts/${id}`}>
        <a className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
          &larr; Retour au post
        </a>
      </Link>

      <h1 className="text-2xl font-bold mb-6">Modifier l'article</h1>

      {error && <div className="mb-4 text-red-500">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titre
          </label>
          <input
            id="title"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Contenu
          </label>
          <textarea
            id="content"
            required
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
            URL de l'image (optionnel)
          </label>
          <input
            id="thumbnail"
            type="url"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={post.thumbnail || ''}
            onChange={(e) => setPost({ ...post, thumbnail: e.target.value || undefined })}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Link href={`/posts/${id}`}>
            <a className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Annuler
            </a>
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}