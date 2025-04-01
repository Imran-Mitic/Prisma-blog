import { useState } from 'react'

interface CreatePostModalProps {
  onClose: () => void
  onPostCreated: (post: any) => void
}

export default function CreatePostModal({ onClose, onPostCreated }: CreatePostModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content, thumbnail }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du post')
      }

      const newPost = await response.json()
      onPostCreated(newPost)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Créer un nouvel article</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>

          {error && <div className="mb-4 text-red-500">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Titre
              </label>
              <input
                id="title"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Contenu
              </label>
              <textarea
                id="content"
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                URL de l'image (optionnel)
              </label>
              <input
                id="thumbnail"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? 'En cours...' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}