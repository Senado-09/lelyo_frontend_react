import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { api } from '../api'

const API_BASE_URL = import.meta.env.VITE_API_URL

type Property = {
  id: number
  name: string
  address: string
  description: string
  image_url?: string
}

const PropertiesList = () => {
  const { t } = useTranslation()
  const [properties, setProperties] = useState<Property[]>([])

  const fetchProperties = async () => {
    try {
      const data = await api.get('/properties')
      setProperties(data)
    } catch (err) {
      toast.error(t('propertiesList.errors.fetch'))
    }
  }

  const handleDelete = async (id: number, name: string) => {
    const confirmDelete = window.confirm(t('propertiesList.confirmDelete', { name }))
    if (!confirmDelete) return

    try {
      await api.delete(`/properties/${id}`)
      toast.success(t('propertiesList.successDelete'))
      setProperties(prev => prev.filter((p) => p.id !== id))
    } catch {
      toast.error(t('propertiesList.errors.delete'))
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((prop) => (
        <div
          key={prop.id}
          className="border rounded-lg overflow-hidden shadow hover:shadow-md transition relative bg-white"
        >
          {prop.image_url && (
            <img
              src={
                prop.image_url.startsWith('http')
                  ? prop.image_url
                  : `${API_BASE_URL.replace(/\/$/, '')}/${prop.image_url.replace(/^\//, '')}`
              }
              alt={prop.name}
              className="w-full h-40 object-cover"
            />
          )}
          <div className="p-4">
            <h2 className="text-lg font-semibold text-[#0A0F1C]">{prop.name}</h2>
            <p className="text-sm text-[#00998B]">{prop.address}</p>
            <p className="text-sm mt-2 text-gray-700">{prop.description}</p>
          </div>
          <button
            onClick={() => handleDelete(prop.id, prop.name)}
            className="absolute top-2 right-2 text-[#00998B] hover:text-[#00B7A3] transition-colors"
            title={t('propertiesList.delete')}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default PropertiesList
