'use client'

import { useState, useRef } from 'react'

interface Props {
  productId: string
  onUploaded?: (images: any[]) => void
}

interface ImagePreview {
  file: File
  preview: string
  alt: string
  order: number
  id: string
}

export default function ProductImageUploader({ productId, onUploaded }: Props) {
  const [previews, setPreviews] = useState<ImagePreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, boolean>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'))

    imageFiles.forEach((file, index) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews((prev) => [
          ...prev,
          {
            file,
            preview: reader.result as string,
            alt: '',
            order: prev.length + index,
            id: Math.random().toString(36).substring(7),
          },
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handlePreviewDelete = (id: string) => {
    setPreviews((prev) => prev.filter((preview) => preview.id !== id))
  }

  const handleAltChange = (id: string, alt: string) => {
    setPreviews((prev) =>
      prev.map((preview) => (preview.id === id ? { ...preview, alt } : preview))
    )
  }

  const handleOrderChange = (id: string, order: number) => {
    setPreviews((prev) =>
      prev.map((preview) => (preview.id === id ? { ...preview, order } : preview))
    )
  }

  const handleUpload = async () => {
    if (previews.length === 0) return

    setIsUploading(true)
    const uploadedImages: any[] = []

    for (const preview of previews) {
      setUploadProgress((prev) => ({ ...prev, [preview.id]: true }))

      try {
        const formData = new FormData()
        formData.append('file', preview.file)
        formData.append('productId', productId)
        formData.append('alt', preview.alt)
        formData.append('order', preview.order.toString())

        const adminApiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''

        const res = await fetch('/api/admin/products/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminApiKey}`,
          },
          body: formData,
        })

        if (!res.ok) {
          const error = await res.json()
          console.error('Upload error:', error)
          continue
        }

        const data = await res.json()
        uploadedImages.push(data.image)
      } catch (error) {
        console.error('Upload error:', error)
      } finally {
        setUploadProgress((prev) => ({ ...prev, [preview.id]: false }))
      }
    }

    setIsUploading(false)
    setPreviews([])

    if (onUploaded && uploadedImages.length > 0) {
      onUploaded(uploadedImages)
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-black bg-gray-50'
            : 'border-gray-300 hover:border-black bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-raleway)' }}>
            Glissez-déposez des images ici ou cliquez pour sélectionner
          </p>
          <p className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-raleway)' }}>
            JPG, PNG, WEBP, GIF
          </p>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((preview) => (
              <div key={preview.id} className="space-y-2">
                <div className="relative group">
                  <img
                    src={preview.preview}
                    alt="Preview"
                    className="w-full aspect-square object-cover rounded border border-gray-200"
                  />
                  <button
                    onClick={() => handlePreviewDelete(preview.id)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                  {uploadProgress[preview.id] && (
                    <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Texte alternatif"
                    value={preview.alt}
                    onChange={(e) => handleAltChange(preview.id, e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 focus:border-transparent"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  />
                  <input
                    type="number"
                    placeholder="Ordre"
                    value={preview.order}
                    onChange={(e) => handleOrderChange(preview.id, parseInt(e.target.value, 10) || 0)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 focus:border-transparent"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full md:w-auto px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            {isUploading ? 'Upload en cours...' : `Uploader ${previews.length} image${previews.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  )
}


