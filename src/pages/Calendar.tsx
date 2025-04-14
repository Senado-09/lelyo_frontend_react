import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Calendar, momentLocalizer, Event } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { AnimatePresence, motion } from 'framer-motion'
import { PlusCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { api } from '../api'

const localizer = momentLocalizer(moment)

type Reservation = {
  id: number
  guest_name: string
  start_date: string
  end_date: string
  property_id: number
}

type Property = {
  id: number
  name: string
}

const CalendarPage = () => {
  const { t } = useTranslation()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editMode, setEditMode] = useState<number | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const [guestName, setGuestName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [propertyId, setPropertyId] = useState<number | null>(null)

  const fetchReservations = async () => {
    try {
      const data = await api.get('/reservations')
      setReservations(data)
    } catch {
      toast.error(t('calendar.alerts.error_load_reservations'))
    }
  }

  const fetchProperties = async () => {
    try {
      const data = await api.get('/properties')
      setProperties(data)
    } catch {
      toast.error(t('calendar.alerts.error_load_properties'))
    }
  }

  useEffect(() => {
    fetchReservations()
    fetchProperties()
  }, [])

  const events = reservations.map((res) => ({
    id: res.id,
    title: res.guest_name,
    start: new Date(res.start_date),
    end: new Date(res.end_date),
    resource: res,
  }))

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event)
    setShowDetails(true)
  }

  const handleEdit = () => {
    const res = selectedEvent?.resource as Reservation
    setGuestName(res.guest_name)
    setStartDate(res.start_date)
    setEndDate(res.end_date)
    setPropertyId(res.property_id)
    setEditMode(res.id)
    setShowDetails(false)
    setModalOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedEvent) return
    const confirmDelete = confirm(t('calendar.alerts.delete_confirm'))
    if (!confirmDelete) return

    try {
      await api.delete(`/reservations/${selectedEvent.id}`)
      toast.success(t('calendar.alerts.success_delete'))
      setShowDetails(false)
      fetchReservations()
    } catch {
      toast.error(t('calendar.alerts.error_delete'))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const confirmSubmit = confirm(
      editMode ? t('calendar.alerts.confirm_update') : t('calendar.alerts.confirm_create')
    )
    if (!confirmSubmit) return

    const payload = {
      guest_name: guestName,
      start_date: startDate,
      end_date: endDate,
      property_id: propertyId,
    }

    try {
      if (editMode) {
        await api.put(`/reservations/${editMode}`, payload)
        toast.success(t('calendar.alerts.success_update'))
      } else {
        await api.post('/reservations', payload)
        toast.success(t('calendar.alerts.success_create'))
      }
      resetForm()
      fetchReservations()
    } catch {
      toast.error(t('calendar.alerts.error_save'))
    }
  }

  const resetForm = () => {
    setModalOpen(false)
    setGuestName('')
    setStartDate('')
    setEndDate('')
    setPropertyId(null)
    setEditMode(null)
    setSelectedEvent(null)
  }

  return (
    <div className="p-6 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-[#00B7A3]">{t('calendar.title')}</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#00B7A3] text-white px-4 py-2 rounded hover:bg-[#00998B] flex items-center gap-2"
          >
            <PlusCircle size={18} /> {t('calendar.new_reservation')}
          </button>
        </div>

        <div className="h-[600px] bg-white p-4 rounded shadow">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      </div>

      {/* ... Modal & Details identiques, inchangés ... */}
    </div>
  )
}

export default CalendarPage
