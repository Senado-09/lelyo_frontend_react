import React, { useEffect, useRef, useState } from 'react'
import { Menu, LogOut, User } from 'lucide-react'
import { logout } from '../utils/auth'
import { useTranslation } from 'react-i18next'

type Props = {
  toggleSidebar: () => void
}

const Navbar = ({ toggleSidebar }: Props) => {
  const { i18n, t } = useTranslation()
  const [userName, setUserName] = useState(t('user'))
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fermer menu si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Charger nom utilisateur depuis token
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUserName(payload.full_name || t('user'))
      } catch {
        setUserName(t('user'))
      }
    }
  }, [t])

  return (
    <header className="h-16 bg-[#F9FAFB] border-b px-4 md:px-6 flex items-center justify-between relative">
      {/* 🍔 Menu burger pour mobile */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-[#0A0F1C]"
          aria-label={t('toggle_menu')}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder={t('search')}
        className="w-full max-w-md px-4 py-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-[#00B7A3] bg-white"
      />

      <div className="flex items-center gap-4">
        {/* 🌐 Sélecteur de langue */}
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

        {/* 👤 Menu utilisateur */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col items-center justify-center gap-1 text-sm text-[#0A0F1C] hover:text-[#00B7A3] transition"
          >
            <div className="bg-[#00B7A3] text-white rounded-full p-2">
              <User size={20} />
            </div>
            <span className="text-xs font-medium hidden sm:block">{userName}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow z-50">
              <button
                onClick={logout}
                className="w-full px-4 py-2 text-left text-sm hover:bg-[#00B7A3]/10 flex items-center gap-2 text-[#0A0F1C]"
              >
                <LogOut size={16} className="text-[#00B7A3]" />
                {t('logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
