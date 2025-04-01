import { useState } from 'react'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string
  thumbnail?: string
  authorId: string
  author: {
    name: string
  }
  createdAt: string
}

interface PostListProps {
  posts: Post[]
  userRole: 'ADMIN' | 'USER'
  userId: string
}

export default function PostList({ posts, userRole, userId }: PostListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (postId: string) => {
    setDeletingId(postId)
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      // Recharger les posts ou filtrer le post supprimé
      window.location.reload()
    } catch (error) {
      console.error(error)
    } finally {
      setDeletingId(null)
    }
  }

  if (posts.length === 0) {
    return <div className="text-gray-500">Aucun article trouvé</div>
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow rounded-lg overflow-hidden">
          {post.thumbnail && (
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <span className="text-sm text-gray-500">
                Par {post.author.name} •{' '}
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
            <div className="flex justify-between items-center">
              <Link href={`/posts/${post.id}`}>
                <a className="text-indigo-600 hover:text-indigo-800">
                  Lire la suite
                </a>
              </Link>
              {(userRole === 'ADMIN' || post.authorId === userId) && (
                <div className="space-x-2">
                  <Link href={`/posts/${post.id}/edit`}>
                    <a className="text-yellow-600 hover:text-yellow-800">
                      Modifier
                    </a>
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    {deletingId === post.id ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}