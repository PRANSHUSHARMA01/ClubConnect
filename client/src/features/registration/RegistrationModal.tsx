import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { register } from '../../app/api'
import type { EventRecord, RegistrationForm } from '../../types'
import { useToast } from '../../app/ToastContext'

const empty = (eventId: string): RegistrationForm => ({ eventId, name: '', email: '', college: '', year: '', phone: '' })
export function RegistrationModal({ event, onClose }: { event: EventRecord | null; onClose: () => void }) {
  const [form, setForm] = useState<RegistrationForm>(() => empty(event?.id || ''))
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [error, setError] = useState('')
  const { notify } = useToast()
  const update = (key: keyof RegistrationForm, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (!form.name || !form.email || !form.college || !form.year || !/^\d{10}$/.test(form.phone)) { setError('Please complete every field. Phone must be exactly 10 digits.'); return }
    setStatus('loading')
    try { await register(form); setStatus('success'); notify('You are on the list. See you there!', 'success') } catch (err) { setStatus('idle'); setError(err instanceof Error ? err.message : 'Unable to register right now.') }
  }
  return <AnimatePresence>{event && <motion.div className="modal-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}><motion.div className="registration-modal" role="dialog" aria-modal="true" aria-labelledby="registration-title" initial={{ opacity: 0, scale: .88, y: 22 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .92, y: 12 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}><button className="modal-close" onClick={onClose} aria-label="Close registration dialog">×</button>{status === 'success' ? <div className="success-state"><motion.div className="success-check" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 12 }}>✓</motion.div><span className="eyebrow">Registration confirmed</span><h2>You’re in.</h2><p>We saved your spot for <strong>{event.name}</strong>. Watch your inbox for the next update.</p><button className="button button-primary" onClick={onClose}>Done <span>↗</span></button></div> : <><span className="eyebrow">Reserve your spot</span><h2 id="registration-title">Join {event.name}</h2><p className="modal-intro">A few details and you’re all set for the next chapter.</p><form onSubmit={submit} className="registration-form"><label>Name<input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" autoFocus /></label><label>Email<input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@college.edu" /></label><div className="field-row"><label>College<input value={form.college} onChange={(e) => update('college', e.target.value)} placeholder="College name" /></label><label>Year<select value={form.year} onChange={(e) => update('year', e.target.value)}><option value="">Select</option><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select></label></div><label>Phone number<input inputMode="numeric" value={form.phone} onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit number" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary button-full pulse-target" disabled={status === 'loading'}>{status === 'loading' ? <><span className="button-spinner" />Saving your spot…</> : <>Confirm registration <span>↗</span></>}</button></form></>}</motion.div></motion.div>}</AnimatePresence>
}
