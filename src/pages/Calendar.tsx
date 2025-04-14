import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Calendar, momentLocalizer, Event } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { AnimatePresence, motion } from 'framer-motion'
import { Pencil, Trash2, PlusCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { api } from '../api' // 📌 Assure-toi du bon chemin

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
  const [modalOpen, setModalOpen] = useState(false)
  const [editMode, setEditMode] = useState<null | number>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const [guestName, setGuestName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [propertyId, setPropertyId] = useState<number | null>(null)
  const [properties, setProperties] = useState<Property[]>([])

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
    resource: res
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
    const confirmed = confirm(t('calendar.alerts.delete_confirm'))
    if (!confirmed) return

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
    const confirmed = confirm(
      editMode ? t('calendar.alerts.confirm_update') : t('calendar.alerts.confirm_create')
    )
    if (!confirmed) return

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

      {/* Détails réservation */}
      <AnimatePresence>
        {showDetails && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded shadow-lg w-full max-w-md relative"
            >
              <h2 className="text-xl font-semibold mb-2">{t('calendar.details.title')}</h2>
              <p><strong>{t('calendar.details.guest')}:</strong> {(selectedEvent.resource as Reservation).guest_name}</p>
              <p><strong>{t('calendar.details.start')}:</strong> {new Date((selectedEvent.resource as Reservation).start_date).toLocaleDateString()}</p>
              <p><strong>{t('calendar.details.end')}:</strong> {new Date((selectedEvent.resource as Reservation).end_date).toLocaleDateString()}</p>
              <p><strong>{t('calendar.details.property')}:</strong> {properties.find(p => p.id === (selectedEvent.resource as Reservation).property_id)?.name || '—'}</p>

              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => setShowDetails(false)} className="px-4 py-2 border rounded hover:bg-gray-100">
                  {t('calendar.actions.close')}
                </button>
                <button onClick={handleEdit} className="bg-[#00B7A3] text-white px-4 py-2 rounded hover:bg-[#00998B]">
                  {t('calendar.actions.edit')}
                </button>
                <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  {t('calendar.actions.delete')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de création/édition */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded shadow-lg w-full max-w-md relative"
            >
              <h2 className="text-xl font-semibold mb-4">
                {editMode ? t('calendar.form.edit') : t('calendar.form.add')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder={t('calendar.form.guest_name') || ''}
                  className="w-full p-2 border rounded"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                />
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
                <select
                  className="w-full p-2 border rounded"
                  value={propertyId ?? ''}
                  onChange={(e) => setPropertyId(parseInt(e.target.value))}
                  required
                >
                  <option value="" disabled>{t('calendar.form.select_property')}</option>
                  {properties.map((prop) => (
                    <option key={prop.id} value={prop.id}>{prop.name}</option>
                  ))}
                </select>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    {t('calendar.form.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#00B7A3] text-white px-4 py-2 rounded hover:bg-[#00998B]"
                  >
                    {editMode ? t('calendar.form.submit_edit') : t('calendar.form.submit_add')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CalendarPage
