import { AnimatePresence, motion } from 'motion/react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ToastProvider } from './ToastContext'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Home } from '../pages/Home'
import { EventsPage } from '../pages/EventsPage'
import { AdminLogin } from '../pages/AdminLogin'
import { AdminDashboard } from '../pages/AdminDashboard'

function RoutedApp() {
  const location = useLocation(); const isAdmin = location.pathname.startsWith('/admin')
  return isAdmin ? <Routes location={location}><Route path="/admin/login" element={<AdminLogin />} /><Route path="/admin" element={<AdminDashboard />} /><Route path="*" element={<Navigate to="/admin" replace />} /></Routes> : <><Navbar /><AnimatePresence mode="wait"><motion.div key={location.pathname} className="route-layer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .38, ease: 'easeOut' }}><Routes location={location}><Route path="/" element={<Home />} /><Route path="/events" element={<EventsPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></motion.div></AnimatePresence><Footer /></>
}
export function App() { return <ToastProvider><RoutedApp /></ToastProvider> }
