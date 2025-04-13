import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const AddProperty = () => {
  const { t } = useTranslation()

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ name?: string; address?: string }>({})

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!name.trim()) newErrors.name = t('addProperty.errors.name')
    if (!address.trim()) newErrors.address = t('addProperty.errors.address')
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    let imageUrl = ''
    if (image) {
      const formData = new FormData()
      formData.append('file', image)
      try {
        const res = await fetch('http://localhost:8000/upload', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        imageUrl = data.url
      } catch {
        toast.error(t('addProperty.errors.upload'))
        return
      }
    }

    try {
      const res = await fetch('http://localhost:8000/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, description, image_url: imageUrl }),
      })

      if (!res.ok) throw new Error()

      toast.success(t('addProperty.success'))
      setName('')
      setAddress('')
      setDescription('')
      setImage(null)
      setImagePreview(null)
    } catch {
      toast.error(t('addProperty.errors.submit'))
    }
  }

  const handleImageChange = (file: File | null) => {
    setImage(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 w-full max-w-2xl mx-auto mb-10 bg-white p-6 rounded-xl shadow"
    >
      <div>
        <input
          type="text"
          placeholder={t('addProperty.namePlaceholder')}
          className="w-full p-3 border rounded outline-none focus:ring-2 focus:ring-[#00B7A3]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <input
          type="text"
          placeholder={t('addProperty.addressPlaceholder')}
          className="w-full p-3 border rounded outline-none focus:ring-2 focus:ring-[#00B7A3]"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      <textarea
        placeholder={t('addProperty.descriptionPlaceholder')}
        className="w-full p-3 border rounded outline-none focus:ring-2 focus:ring-[#00B7A3]"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-[#00B7A3] file:text-white hover:file:bg-[#00998B]"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-4 w-full h-48 object-cover rounded-lg border"
          />
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-[#00B7A3] text-white py-3 rounded hover:bg-[#00998B] transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        {t('addProperty.submitButton')}
      </button>
    </form>
  )
}

export default AddProperty
