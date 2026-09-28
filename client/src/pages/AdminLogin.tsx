import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { login } from '../app/api'
import { Logo } from '../components/Logo'

export function AdminLogin() {
  const [email, setEmail] = useState('admin@club.com'); const [password, setPassword] = useState('admin123'); const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const navigate = useNavigate()
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setLoading(true); setError(''); try { const result = await login(email, password); localStorage.setItem('clubconnect_admin_token', result.token); navigate('/admin') } catch (err) { setError(err instanceof Error ? err.message : 'Unable to sign in.') } finally { setLoading(false) } }
  return <main className="auth-page"><motion.div className="auth-card" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}><Link to="/" className="auth-logo"><Logo /></Link><span className="eyebrow">Admin access</span><h1>Welcome back,<br /><em>operator.</em></h1><p>Manage the calendar, make space for more people and keep the club moving.</p><form onSubmit={submit} className="auth-form"><label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary button-full" disabled={loading}>{loading ? <><span className="button-spinner" />Checking…</> : <>Enter dashboard <span>↗</span></>}</button></form><Link className="back-link" to="/">← Back to ClubConnect</Link></motion.div></main>
}
