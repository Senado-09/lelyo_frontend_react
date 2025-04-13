import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { useTranslation } from 'react-i18next'

type DashboardData = {
  total_properties: number
  today_reservations: number
  today_tasks: number
}

const Dashboard = () => {
  const { t } = useTranslation()
  const [data, setData] = useState<DashboardData | null>(null)
  const [weekData, setWeekData] = useState<{ date: string; count: number }[]>([])
  const [alerts, setAlerts] = useState<{
    late_tasks: { id: number; title: string; date: string; property_id: number }[]
    tomorrow_reservations: {
      id: number
      guest_name: string
      start_date: string
      end_date: string
      property_id: number
    }[]
  } | null>(null)

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:8000/dashboard')
      const json = await res.json()
      setData(json)
    } catch {
      toast.error(t('dashboard.errors.load_dashboard'))
    }
  }

  const fetchAlerts = async () => {
    try {
      const res = await fetch('http://localhost:8000/dashboard/alerts')
      const data = await res.json()
      setAlerts(data)
    } catch {
      toast.error(t('dashboard.errors.load_alerts'))
    }
  }

  const fetchWeeklyReservations = async () => {
    try {
      const res = await fetch('http://localhost:8000/dashboard/reservations_week')
      const data = await res.json()
      setWeekData(data)
    } catch {
      toast.error(t('dashboard.errors.load_week'))
    }
  }

  useEffect(() => {
    fetchData()
    fetchWeeklyReservations()
    fetchAlerts()
  }, [])

  if (!data) return <p className="p-6">{t('dashboard.loading')}</p>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[#0A0F1C]">{t('dashboard.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#E0F7F4] p-4 rounded shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2 text-[#0A0F1C]">{t('dashboard.cards.properties.title')}</h2>
          <p className="text-4xl font-bold text-[#00B7A3]">{data.total_properties}</p>
          <Link to="/properties" className="text-sm text-[#00998B] underline mt-2 inline-block">
            {t('dashboard.cards.properties.link')}
          </Link>
        </div>

        <div className="bg-[#E0F7F4] p-4 rounded shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2 text-[#0A0F1C]">{t('dashboard.cards.today_reservations.title')}</h2>
          <p className="text-4xl font-bold text-[#00B7A3]">{data.today_reservations}</p>
          <Link to="/calendar" className="text-sm text-[#00998B] underline mt-2 inline-block">
            {t('dashboard.cards.today_reservations.link')}
          </Link>
        </div>

        <div className="bg-[#E0F7F4] p-4 rounded shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2 text-[#0A0F1C]">{t('dashboard.cards.today_tasks.title')}</h2>
          <p className="text-4xl font-bold text-[#00B7A3]">{data.today_tasks}</p>
          <Link to="/tasks" className="text-sm text-[#00998B] underline mt-2 inline-block">
            {t('dashboard.cards.today_tasks.link')}
          </Link>
        </div>
      </div>

      <div className="mt-10 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-[#0A0F1C]">{t('dashboard.chart.title')}</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#00B7A3" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {alerts && (
        <div className="mt-10 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-[#00B7A3]">🚨 {t('dashboard.alerts.title')}</h2>

          {alerts.late_tasks.length > 0 ? (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-[#00998B]">{t('dashboard.alerts.late_tasks.title')}</h3>
              <ul className="list-disc list-inside">
                {alerts.late_tasks.map((task) => (
                  <li key={task.id}>
                    <span className="font-medium">{task.title}</span> – {t('dashboard.alerts.late_tasks.suffix', {
                      date: task.date,
                      id: task.property_id,
                    })}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-[#00B7A3] mb-6">{t('dashboard.alerts.late_tasks.empty')}</p>
          )}

          {alerts.tomorrow_reservations.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#0A0F1C]">{t('dashboard.alerts.tomorrow.title')}</h3>
              <ul className="list-disc list-inside">
                {alerts.tomorrow_reservations.map((res) => (
                  <li key={res.id}>
                    <span className="font-medium">{res.guest_name}</span> {t('dashboard.alerts.tomorrow.suffix', {
                      start: res.start_date,
                      end: res.end_date,
                      id: res.property_id,
                    })}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-[#00B7A3]">{t('dashboard.alerts.tomorrow.empty')}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard
