'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateCategory } from './actions'

interface Category {
  id: string
  name: string
  slug: string
  imageUrl?: string | null
}

interface EditCategoryFormProps {
  category: Category
}

function EditCategoryForm({ category }: EditCategoryFormProps) {
  const [name, setName] = useState(category.name)
  const [slug, setSlug] = useState(category.slug)
  const [imagePreview, setImagePreview] = useState<string | null>(category.imageUrl || null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function slugify(value: string) {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    if (!slug) setSlug(slugify(value))
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(slugify(e.target.value))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const onSubmit = (formData: FormData) => {
    setError(null)
    startTransition(async () => {
      try {
        const result = await updateCategory(category.id, formData)
        if (result && result.ok === false && result.error) {
          setError(result.error)
        } else {
          // Success - redirect will happen in server action
          // But we can refresh to show updated image
          router.refresh()
        }
      } catch (err: any) {
        // Check if this is a redirect error (NEXT_REDIRECT) - if so, it's not an error
        if (err && typeof err === 'object' && ('digest' in err || err.message?.includes('NEXT_REDIRECT'))) {
          // This is a redirect, not an error - let it propagate
          return
        }
        setError(err.message || 'Erreur lors de la mise à jour')
      }
    })
  }

  return (
    <form action={onSubmit} className="max-w-xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <p
          className="text-xs uppercase tracking-[0.3em] text-neutral-500"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          [ 04 · MODIFIER CATÉGORIE ]
        </p>
        <h1
          className="text-2xl md:text-3xl lg:text-4xl text-neutral-900"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Modifier : {category.name}
        </h1>
        <p
          className="text-sm text-neutral-600 max-w-md"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Modifiez le nom et le slug de la catégorie.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Name */}
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-xs uppercase tracking-[0.2em] text-neutral-700"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Nom
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={handleNameChange}
          className="w-full border border-neutral-300 bg-frost px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none"
          style={{ fontFamily: 'var(--font-raleway)' }}
          required
        />
      </div>

      {/* Slug */}
      <div className="space-y-1">
        <label
          htmlFor="slug"
          className="block text-xs uppercase tracking-[0.2em] text-neutral-700"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          value={slug}
          onChange={handleSlugChange}
          className="w-full border border-neutral-300 bg-frost px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none font-mono"
          style={{ fontFamily: 'var(--font-raleway)' }}
          required
        />
        <p className="mt-1 text-xs text-neutral-500" style={{ fontFamily: 'var(--font-raleway)' }}>
          Utilisé dans l'URL : <span className="font-mono text-neutral-700">/boutique/&lt;slug&gt;</span>
        </p>
      </div>

      {/* Image Upload */}
      <div className="space-y-1">
        <label
          htmlFor="image"
          className="block text-xs uppercase tracking-[0.2em] text-neutral-700"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Image de la catégorie
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border border-neutral-300 bg-frost px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none"
          style={{ fontFamily: 'var(--font-raleway)' }}
        />
        {imagePreview && (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-700 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
              Aperçu
            </p>
            <div className="relative w-32 h-32 border border-neutral-300 overflow-hidden bg-gray-100">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center border border-black bg-black px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-frost hover:text-black disabled:opacity-60"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          {isPending ? 'Mise à jour...' : 'Mettre à jour'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/categories')}
          className="text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-800 transition-colors"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Annuler
        </button>
      </div>
    </form>
  )
}

export default EditCategoryForm

