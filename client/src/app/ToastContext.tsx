import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'

type Toast = { id: number; message: string; tone: 'success' | 'error' | 'info' }
const ToastContext = createContext<{ notify: (message: string, tone?: Toast['tone']) => void }>({ notify: () => undefined })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const notify = useCallback((message: string, tone: Toast['tone'] = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, message, tone }])
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4200)
  }, [])
  const value = useMemo(() => ({ notify }), [notify])
  return <ToastContext.Provider value={value}>{children}<div className="toast-stack" aria-live="polite"><AnimatePresence>{toasts.map((toast) => <motion.div key={toast.id} className={`toast toast-${toast.tone}`} initial={{ opacity: 0, y: 18, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: .3 }}><span className="toast-dot" />{toast.message}</motion.div>)}</AnimatePresence></div></ToastContext.Provider>
}
export const useToast = () => useContext(ToastContext)
