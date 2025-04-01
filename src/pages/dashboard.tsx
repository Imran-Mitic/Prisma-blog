import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PostList from '../component/PostList'
import CreatePostModal from '../component/CreatePostModal'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'USER'
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const userRes = await fetch('/api/auth/me')
        if (!userRes.ok) {
          throw new Error('Non authentifié')
        }
        const userData = await userRes.json()
        setUser(userData)


        const postsRes = await fetch('/api/posts')
        if (postsRes.ok) {
          const postsData = await postsRes.json()
          setPosts(postsData)
        }
      } catch (error) {
        router.push('/auth/login')
      }
    }

    fetchUserAndPosts()
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  const handlePostCreated = (newPost: any) => {
    setPosts([newPost, ...posts])
    setShowModal(false)
  }

  if (!user) {
    return <div className="p-4">Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-500">
              Connecté en tant que {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Mes articles</h2>
          {user.role === 'ADMIN' || (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Créer un article
            </button>
          )}
        </div>

        <PostList posts={posts} userRole={user.role} userId={user.id} />

        {showModal && (
          <CreatePostModal
            onClose={() => setShowModal(false)}
            onPostCreated={handlePostCreated}
          />
        )}
      </main>
    </div>
  )
}