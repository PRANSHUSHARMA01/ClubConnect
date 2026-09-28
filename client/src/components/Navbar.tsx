import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Logo } from './Logo'

const links = [{ to: '/', label: 'Home' }, { to: '/events', label: 'Events' }]
export function Navbar() {
  const [open, setOpen] = useState(false)
  useEffect(() => { if (!open) return; const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }; document.addEventListener('keydown', onKeyDown); return () => document.removeEventListener('keydown', onKeyDown) }, [open])
  return <header className="site-header"><div className="container nav-inner"><Link to="/" className="nav-logo" onClick={() => setOpen(false)}><Logo /></Link><nav className="desktop-nav" aria-label="Primary">{links.map((link) => <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>{link.label}</NavLink>)}<Link to="/events" className="nav-join">Join the club <span>↗</span></Link></nav><button className={`menu-toggle ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}><span /><span /><span /></button><AnimatePresence>{open && <motion.div role="dialog" aria-modal="true" aria-label="Mobile navigation" className="mobile-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}><div className="drawer-top"><Logo compact /><button className="drawer-close" onClick={() => setOpen(false)} aria-label="Close menu">×</button></div>{links.map((link, index) => <motion.div key={link.to} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .07 }}><NavLink to={link.to} end={link.to === '/'} onClick={() => setOpen(false)}>{link.label}<span>↗</span></NavLink></motion.div>)}<Link to="/events" className="drawer-join" onClick={() => setOpen(false)}>Join the club <span>↗</span></Link></motion.div>}</AnimatePresence></div></header>
}
