import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo.jpg'
import {
  Home,
  Building2,
  CalendarDays,
  CheckSquare,
  BarChart2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

type Props = {
  isOpen: boolean
  toggleSidebar: () => void
}

const Sidebar = ({ isOpen, toggleSidebar }: Props) => {
  const { t } = useTranslation()
  const location = useLocation()

  const navItems = [
    { label: t('sidebar.dashboard'), path: '/', icon: <Home size={18} /> },
    { label: t('sidebar.properties'), path: '/properties', icon: <Building2 size={18} /> },
    { label: t('sidebar.calendar'), path: '/calendar', icon: <CalendarDays size={18} /> },
    { label: t('sidebar.tasks'), path: '/tasks', icon: <CheckSquare size={18} /> },
    { label: t('sidebar.stats'), path: '/stats', icon: <BarChart2 size={18} /> },
  ]

  return (
    <>
      {/* 📱 Mobile sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-60 bg-white shadow-lg z-50 transition-transform transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:hidden
        `}
      >
        <div className="flex items-center justify-between px-4 pt-4">
          <span className="text-lg font-semibold text-[#00B7A3]">{t('sidebar.menu')}</span>
          <button onClick={toggleSidebar} className="text-[#0A0F1C]">
            ✖
          </button>
        </div>

        <div className="h-full p-4 pt-2 flex flex-col gap-8">
          <img src={logo} alt="Logo" className="w-20 h-20 mx-auto mt-2" />
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={toggleSidebar}
                className={`flex items-center gap-2 p-2 rounded hover:bg-[#00B7A3]/10 ${
                  location.pathname === item.path ? 'bg-[#00B7A3]/20 font-semibold' : ''
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* 🗅️ Desktop sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r h-full">
        <div className="h-full p-4 flex flex-col gap-8">
          <img src={logo} alt="Logo" className="w-24 h-24 mx-auto mt-2" />
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 p-2 rounded hover:bg-[#00B7A3]/10 ${
                  location.pathname === item.path ? 'bg-[#00B7A3]/20 font-semibold' : ''
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar