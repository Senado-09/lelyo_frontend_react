import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import logo from '../assets/logo.jpg'
import { Eye, EyeOff } from "lucide-react"
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'

const Register = () => {
  const { t } = useTranslation()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('register.errors.password_mismatch'))
      return
    }

    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          email,
          password,
        }),
      })

      if (!response.ok) {
        toast.error(t('register.errors.server'))
        throw new Error('Erreur serveur')
      }

      const data = await response.json()
      if (data.success) {
        toast.success(t('register.success'))
        navigate('/login')
      }
    } catch (err) {
      setError(t('register.errors.generic'))
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Partie gauche */}
      <div className="hidden md:flex w-1/2 bg-[#0A0F1C] text-white flex-col justify-center items-center p-10">
        <img src={logo} alt="Logo" className="w-24 h-24 mb-4" />
        <h2 className="text-3xl font-semibold mb-2">{t('register.welcome')}</h2>
        <p className="text-lg text-center max-w-md">
          {t('register.description')}
        </p>
      </div>

      {/* Mobile header */}
      <div className="md:hidden flex flex-col items-center p-6">
        <img src={logo} alt="Logo" className="w-20 h-20 mb-3" />
        <h2 className="text-xl font-semibold text-[#0A0F1C] mb-1">{t('register.title')}</h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          {t('register.subtitle')}
        </p>
      </div>

      {/* Formulaire avec animation */}
      <motion.div
        className="flex w-full md:w-1/2 justify-center items-center p-6"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="hidden md:block text-3xl font-bold text-[#0A0F1C]">
              {t('register.title')}
            </h1>
            <select
              onChange={(e) => {
                const lang = e.target.value
                i18n.changeLanguage(lang)
                localStorage.setItem('i18nextLng', lang)
              }}
              value={i18n.language}
              className="text-sm border rounded px-2 py-1 bg-white text-[#0A0F1C] focus:ring-2 focus:ring-[#00B7A3]"
            >
              <option value="fr">FR</option>
              <option value="en">EN</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder={t('register.full_name') || ''}
              className="w-full p-3 border rounded outline-none focus:ring-2 focus:ring-[#00B7A3]"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="tel"
              placeholder={t('register.phone') || ''}
              className="w-full p-3 border rounded outline-none focus:ring-2 focus:ring-[#00B7A3]"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="email"
              placeholder={t('register.email') || ''}
              className="w-full p-3 border rounded outline-none focus:ring-2 focus:ring-[#00B7A3]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t('register.password') || ''}
                className="w-full p-3 pr-10 border rounded outline-none focus:ring-2 focus:ring-[#00B7A3]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00B7A3]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20}/>} 
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t('register.confirm_password') || ''}
                className="w-full p-3 pr-10 border rounded outline-none focus:ring-2 focus:ring-[#00B7A3]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00B7A3]"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20}/>} 
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-[#00B7A3] text-white py-2 rounded hover:bg-[#00998B] transition-colors"
            >
              {t('register.submit')}
            </button>
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">{t('register.already_account')} </span>
              <a href="/login" className="text-[#00B7A3] hover:underline font-medium">
                {t('register.login')}
              </a>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default Register