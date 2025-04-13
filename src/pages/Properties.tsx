import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropertiesList from './PropertiesList'
import AddProperty from './AddProperty'
import { ListOrdered, Plus } from 'lucide-react'

const Properties = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState<'list' | 'add'>('list')

  const tabs = [
    { id: 'list', label: t('properties.tabs.list'), icon: <ListOrdered size={18} /> },
    { id: 'add', label: t('properties.tabs.add'), icon: <Plus size={18} /> },
  ] as const

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#0A0F1C]">{t('properties.title')}</h1>

      {/* Tabs */}
      <div className="relative border-b mb-6">
        <nav className="flex gap-4 relative">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 py-2 px-4 border-b-2 transition-all duration-300 ease-in-out ${
                tab === t.id
                  ? 'border-[#00B7A3] text-[#00B7A3] font-semibold'
                  : 'border-transparent text-gray-600 hover:text-[#00998B]'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {tab === 'list' ? <PropertiesList /> : <AddProperty />}
    </div>
  )
}

export default Properties
