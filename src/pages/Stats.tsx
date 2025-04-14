import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { BarChart3, ClipboardCheck, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { api } from '../api'

// Types
type Stats = {
  reservations: number
  taches_total: number
  taches_terminees: number
  taches_a_faire: number
  occupation_taux: string
}

type Property = {
  id: number
  name: string
}

const StatsPage = () => {
  const { t } = useTranslation()
  const [stats, setStats] = useState<Stats | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null)
  const [evolutionData, setEvolutionData] = useState<{ date: string; count: number }[]>([])

  const fetchStats = async (propertyId?: number) => {
    try {
      const query = propertyId ? `?property_id=${propertyId}` : ''
      const data = await api.get(`/stats${query}`)
      setStats(data)
    } catch {
      toast.error(t('stats.alerts.load_error'))
    }
  }

  const fetchProperties = async () => {
    try {
      const data = await api.get('/properties')
      setProperties(data)
    } catch {
      toast.error(t('stats.alerts.load_properties_error'))
    }
  }

  const fetchEvolution = async (propertyId?: number) => {
    try {
      const query = propertyId ? `?property_id=${propertyId}` : ''
      const data = await api.get(`/stats/reservations_over_time${query}`)
      setEvolutionData(data)
    } catch {
      toast.error(t('stats.alerts.evolution_error'))
    }
  }

  useEffect(() => {
    fetchProperties()
    fetchStats()
  }, [])

  useEffect(() => {
    fetchStats(selectedProperty || undefined)
    fetchEvolution(selectedProperty || undefined)
  }, [selectedProperty])

  if (!stats) return <p className="p-6">{t('stats.loading')}</p>

  return (
    <div className="p-6 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-[#00B7A3]">{t('stats.title')}</h1>

          <select
            className="p-2 border rounded"
            value={selectedProperty ?? ''}
            onChange={(e) =>
              setSelectedProperty(e.target.value ? parseInt(e.target.value) : null)
            }
          >
            <option value="">{t('stats.filter.all')}</option>
            {properties.map((prop) => (
              <option key={prop.id} value={prop.id}>
                {prop.name}
              </option>
            ))}
          </select>
        </div>

        {/* 📊 Résumés statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#E6FFFC] p-4 rounded shadow">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="text-[#00B7A3]" size={20} />
              <h2 className="text-xl font-semibold text-[#0A0F1C]">
                {t('stats.cards.reservations')}
              </h2>
            </div>
            <p className="text-4xl font-bold text-[#00B7A3]">{stats.reservations}</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded shadow">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardCheck className="text-yellow-700" size={20} />
              <h2 className="text-xl font-semibold text-yellow-700">
                {t('stats.cards.tasks.title')}
              </h2>
            </div>
            <p>✅ {t('stats.cards.tasks.completed')} : {stats.taches_terminees}</p>
            <p>🕓 {t('stats.cards.tasks.pending')} : {stats.taches_a_faire}</p>
            <p className="mt-2 font-bold">
              {t('stats.cards.tasks.total')} : {stats.taches_total}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded shadow">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-green-700" size={20} />
              <h2 className="text-xl font-semibold text-green-700">
                {t('stats.cards.occupancy')}
              </h2>
            </div>
            <p className="text-3xl font-bold text-green-700">
              {stats.occupation_taux}
            </p>
          </div>
        </div>

        {/* 🥧 Pie chart */}
        <div className="mt-10 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-[#0A0F1C]">{t('stats.pie.title')}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: t('stats.pie.pending'), value: stats.taches_a_faire },
                    { name: t('stats.pie.completed'), value: stats.taches_terminees }
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  <Cell fill="#facc15" />
                  <Cell fill="#22c55e" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 📈 Line chart */}
        <div className="mt-10 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-[#0A0F1C]">{t('stats.line.title')}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#00B7A3" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsPage
