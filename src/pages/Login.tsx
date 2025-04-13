import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import logo from '../assets/logo.jpg'
import { Eye, EyeOff } from "lucide-react"
import LoadingButton from '../components/LoadingButton'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'

const Login = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        toast.error(t('login.error'))
        throw new Error('Login failed')
      }

      const data = await response.json()
      if (data.access_token) {
        toast.success(t('login.success'))
        localStorage.setItem('auth_token', data.access_token)
        navigate('/')
      }      
    } catch (err) {
      setError(t('login.error_credentials'))
    }finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Gauche - Desktop */}
      <div className="hidden md:flex w-1/2 bg-[#0A0F1C] text-white flex-col justify-center items-center p-10">
        <img src={logo} alt="Logo" className="w-24 h-24 mb-4" />
        <h2 className="text-3xl font-semibold mb-2">{t('login.welcome')}</h2>
        <p className="text-lg text-center max-w-md">
          {t('login.description')}
        </p>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex flex-col items-center p-6">
        <img src={logo} alt="Logo" className="w-20 h-20 mb-3" />
        <h2 className="text-xl font-semibold text-[#0A0F1C] mb-1">{t('login.title')}</h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          {t('login.subtitle')}
        </p>
      </div>

      {/* Formulaire avec animation */}
      <motion.div
        className="flex w-full md:w-1/2 justify-center items-center p-6"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="hidden md:block text-3xl font-bold text-[#0A0F1C]">
              {t('login.title')}
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
              type="email"
              placeholder={t('login.email') || 'Email'}
              className="w-full p-3 border rounded outline-none focus:ring-2 focus:ring-[#00B7A3]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t('login.password') || 'Mot de passe'}
                className="w-full p-3 pr-10 border rounded outline-none focus:ring-2 focus:ring-[#00B7A3]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00B7A3]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <LoadingButton isLoading={isLoading} type="submit" className="w-full">
              {t('login.submit')}
            </LoadingButton>
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">{t('login.no_account')} </span>
              <a href="/register" className="text-[#00B7A3] hover:underline font-medium">
                {t('login.create_account')}
              </a>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default Login