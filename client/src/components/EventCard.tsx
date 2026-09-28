import { motion } from 'motion/react'
import type { EventRecord } from '../types'

const formatDate = (date: string) => new Intl.DateTimeFormat('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(`${date}T00:00:00`))
export function EventCard({ event, onRegister }: { event: EventRecord; onRegister?: (event: EventRecord) => void }) {
  return <motion.article className="event-card" layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -6 }} whileTap={{ scale: .985 }} transition={{ duration: .45, ease: 'easeOut' }}><div className="event-image-wrap"><img src={event.imageUrl} alt="" className="event-image" loading="lazy" /><span className="event-category">{event.category}</span>{event.featured && <span className="featured-mini">Featured</span>}</div><div className="event-body"><div className="event-meta"><span>{formatDate(event.date)}</span><span className="meta-sep">•</span><span>{event.time}</span></div><h3>{event.name}</h3><p>{event.description}</p><div className="event-footer"><span className="event-venue"><span className="pin">⌖</span>{event.venue}</span>{onRegister && <button className="text-button" onClick={() => onRegister(event)}>Register <span>↗</span></button>}</div></div></motion.article>
}
