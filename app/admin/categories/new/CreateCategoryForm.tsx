'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory } from './actions'

function CreateCategoryForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
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
    if (!slug) {
      setSlug(slugify(value))
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(slugify(e.target.value))
  }

  const onSubmit = (formData: FormData) => {
    setError(null)
    startTransition(async () => {
      const result = await createCategory(formData)
      if (result && result.ok === false && result.error) {
        setError(result.error)
      } else {
        // redirect is handled in server action
      }
    })
  }

  return (
    <form
      action={onSubmit}
      className="max-w-xl space-y-8"
    >
      {/* Top intro text */}
      <div className="space-y-2">
        <p
          className="text-xs tracking-[0.3em] uppercase text-neutral-500"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          [ 04 · NOUVELLE CATÉGORIE ]
        </p>
        <h1
          className="text-2xl md:text-3xl lg:text-4xl text-neutral-900"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Créer une catégorie
        </h1>
        <p
          className="text-sm text-neutral-600 max-w-md"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Définissez un nom et un identifiant unique (slug) pour organiser les familles de produits dans la boutique.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Name */}
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-xs tracking-[0.2em] uppercase text-neutral-700"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Nom de la catégorie
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={handleNameChange}
          className="w-full border border-neutral-300 bg-frost px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none"
          style={{ fontFamily: 'var(--font-raleway)' }}
        />
      </div>

      {/* Slug */}
      <div className="space-y-1">
        <label
          htmlFor="slug"
          className="block text-xs tracking-[0.2em] uppercase text-neutral-700"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          value={slug}
          onChange={handleSlugChange}
          className="w-full border border-neutral-300 bg-frost px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none font-mono"
          placeholder="ex: chaises, fauteuils, consoles..."
          style={{ fontFamily: 'var(--font-raleway)' }}
        />
        <p className="mt-1 text-xs text-neutral-500" style={{ fontFamily: 'var(--font-raleway)' }}>
          Utilisé dans l'URL : <span className="font-mono text-neutral-700">/boutique/&lt;slug&gt;</span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center border border-black bg-black px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-frost hover:text-black disabled:opacity-60"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          {isPending ? 'Enregistrement...' : 'Enregistrer la catégorie'}
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

export default CreateCategoryForm

