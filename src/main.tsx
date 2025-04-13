import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import './index.css'
import './i18n'

import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import Calendar from './pages/Calendar'
import Tasks from './pages/Tasks'
import Stats from './pages/Stats'
import Login from './pages/Login'
import Register from './pages/Register'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'

// Nouveau composant App avec transitions
const AppRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/properties"
          element={
            <PrivateRoute>
              <Layout>
                <Properties />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <Layout>
                <Calendar />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Layout>
                <Tasks />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <PrivateRoute>
              <Layout>
                <Stats />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

const App = () => (
  <BrowserRouter>
    <Toaster position="top-right" />
    <AppRoutes />
  </BrowserRouter>
)

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
