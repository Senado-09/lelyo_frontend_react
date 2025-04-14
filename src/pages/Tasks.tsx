import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Filter, PlusCircle, Trash2, Pencil, CheckCircle, Clock,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { api } from '../api'

type Task = {
  id: number
  title: string
  description: string
  date: string
  status: string
  property_id: number
}

type Property = {
  id: number
  name: string
}

const TasksPage = () => {
  const { t } = useTranslation()
  const [tasks, setTasks] = useState<Task[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [propertyId, setPropertyId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editMode, setEditMode] = useState<number | null>(null)

  const fetchTasks = async () => {
    const path = selectedProperty
      ? `/tasks/by_property/${selectedProperty}`
      : '/tasks'

    try {
      const data = await api.get(path)
      setTasks(data)
    } catch {
      toast.error(t('tasks.alerts.load_error'))
    }
  }

  const fetchProperties = async () => {
    try {
      const data = await api.get('/properties')
      setProperties(data)
    } catch {
      toast.error(t('tasks.alerts.load_properties_error'))
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [selectedProperty])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const confirmed = confirm(editMode ? t('tasks.alerts.confirm_update') : t('tasks.alerts.confirm_create'))
    if (!confirmed) return

    const payload = {
      title,
      description,
      date,
      status: 'à faire',
      property_id: propertyId,
    }

    try {
      if (editMode) {
        await api.put(`/tasks/${editMode}`, payload)
        toast.success(t('tasks.alerts.success_update'))
      } else {
        await api.post('/tasks', payload)
        toast.success(t('tasks.alerts.success_create'))
      }

      resetForm()
      fetchTasks()
    } catch {
      toast.error(t('tasks.alerts.save_error'))
    }
  }

  const toggleStatus = async (id: number) => {
    try {
      await api.patch(`/tasks/${id}/toggle`, {})
      toast.success(t('tasks.alerts.success_toggle'))
      fetchTasks()
    } catch {
      toast.error(t('tasks.alerts.toggle_error'))
    }
  }

  const deleteTask = async (id: number) => {
    const confirmed = confirm(t('tasks.alerts.confirm_delete'))
    if (!confirmed) return

    try {
      await api.delete(`/tasks/${id}`)
      toast.success(t('tasks.alerts.success_delete'))
      fetchTasks()
    } catch {
      toast.error(t('tasks.alerts.delete_error'))
    }
  }

  const handleEdit = (task: Task) => {
    setTitle(task.title)
    setDescription(task.description)
    setDate(task.date)
    setPropertyId(task.property_id)
    setEditMode(task.id)
    setModalOpen(true)
  }

  const resetForm = () => {
    setModalOpen(false)
    setEditMode(null)
    setTitle('')
    setDescription('')
    setDate('')
    setPropertyId(null)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#00B7A3] mb-4">{t('tasks.title')}</h1>

      {/* Filtres & bouton */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#E6FFFC] p-4 rounded shadow flex items-center gap-2">
          <Filter className="text-[#00B7A3]" size={20} />
          <label className="font-medium text-[#00B7A3]">{t('tasks.filter.label')}</label>
          <select
            className="p-2 border rounded flex-1"
            value={selectedProperty ?? ''}
            onChange={(e) =>
              setSelectedProperty(e.target.value ? parseInt(e.target.value) : null)
            }
          >
            <option value="">{t('tasks.filter.all')}</option>
            {properties.map((prop) => (
              <option key={prop.id} value={prop.id}>{prop.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end items-center">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#00B7A3] text-white py-2 px-4 rounded hover:bg-[#00998B] flex items-center gap-2"
          >
            <PlusCircle size={18} /> {t('tasks.add_button')}
          </button>
        </div>
      </div>

      {/* Tableau des tâches */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-[#E6FFFC] text-left">
              <th className="p-2">{t('tasks.table.date')}</th>
              <th className="p-2">{t('tasks.table.title')}</th>
              <th className="p-2">{t('tasks.table.description')}</th>
              <th className="p-2">{t('tasks.table.status')}</th>
              <th className="p-2">{t('tasks.table.property')}</th>
              <th className="p-2">{t('tasks.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const property = properties.find((p) => p.id === task.property_id)
              return (
                <tr
                  key={task.id}
                  className={`border-t ${task.status === 'terminée' ? 'bg-green-50 text-gray-500 line-through' : ''}`}
                >
                  <td className="p-2">{task.date}</td>
                  <td className="p-2">{task.title}</td>
                  <td className="p-2">{task.description}</td>
                  <td className="p-2">
                    <button
                      onClick={() => toggleStatus(task.id)}
                      className="group relative flex items-center gap-2 text-sm text-left px-2 py-1 rounded hover:bg-gray-100 border border-gray-200 transition cursor-pointer"
                    >
                      {task.status === 'terminée' ? (
                        <><CheckCircle size={16} className="text-green-600" /> {t('tasks.status.done')}</>
                      ) : (
                        <><Clock size={16} className="text-yellow-500" /> {t('tasks.status.pending')}</>
                      )}
                      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition text-xs bg-black text-white px-2 py-1 rounded whitespace-nowrap">
                        {task.status === 'terminée'
                          ? t('tasks.status.tooltip.revert')
                          : t('tasks.status.tooltip.complete')}
                      </span>
                    </button>
                  </td>
                  <td className="p-2">{property?.name || '—'}</td>
                  <td className="p-2 text-right flex gap-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
                    >
                      <Pencil size={14} /> {t('tasks.actions.edit')}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} /> {t('tasks.actions.delete')}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
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
                {editMode ? t('tasks.modal.edit') : t('tasks.modal.add')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder={t('tasks.form.title') || ''}
                  className="w-full p-2 border rounded"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder={t('tasks.form.description') || ''}
                  className="w-full p-2 border rounded min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <select
                  className="w-full p-2 border rounded"
                  value={propertyId ?? ''}
                  onChange={(e) => setPropertyId(parseInt(e.target.value))}
                  required
                >
                  <option value="" disabled>{t('tasks.form.select_property')}</option>
                  {properties.map((prop) => (
                    <option key={prop.id} value={prop.id}>{prop.name}</option>
                  ))}
                </select>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    {t('tasks.form.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#00B7A3] text-white px-4 py-2 rounded hover:bg-[#00998B]"
                  >
                    {editMode ? t('tasks.form.submit_edit') : t('tasks.form.submit_add')}
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

export default TasksPage
