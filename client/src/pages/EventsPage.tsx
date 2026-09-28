import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { getEvents } from '../app/api'
import { EventCard } from '../components/EventCard'
import { EmptyState, SkeletonCard } from '../components/States'
import { RegistrationModal } from '../features/registration/RegistrationModal'
import type { EventRecord } from '../types'

const categories = ['All', 'Workshop', 'Hackathon', 'Contest', 'Talk', 'Social']
export function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState<'upcoming' | 'past' | 'all'>('upcoming')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<EventRecord | null>(null)
  useEffect(() => { setLoading(true); getEvents({ search, category, status }).then(({ events }) => setEvents(events)).finally(() => setLoading(false)) }, [search, category, status])
  const intro = useMemo(() => status === 'past' ? 'Things we’ve already shipped.' : status === 'all' ? 'The full club archive, in one place.' : 'A good reason to open your calendar.' , [status])
  return <main className="events-page"><section className="page-hero"><div className="container"><span className="eyebrow"><span className="eyebrow-dot" />The calendar</span><h1>Find your next<br /><em>good challenge.</em></h1><p>Talks, workshops, contests and the occasional excuse to stay late on campus.</p></div></section><section className="events-catalog section"><div className="container"><div className="catalog-toolbar"><div className="search-wrap"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events" aria-label="Search events" /></div><div className="status-toggle" role="tablist">{(['upcoming', 'past', 'all'] as const).map((item) => <button key={item} className={status === item ? 'selected' : ''} onClick={() => setStatus(item)} role="tab" aria-selected={status === item}>{item === 'all' ? 'All events' : item[0].toUpperCase() + item.slice(1)}</button>)}</div></div><div className="category-row">{categories.map((item) => <button key={item} className={`filter-pill ${category === item ? 'selected' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="catalog-heading"><div><span className="eyebrow">{status === 'all' ? '01 / The archive' : '01 / Curated for you'}</span><h2>{intro}</h2></div><span className="result-count">{loading ? 'Loading…' : `${events.length} ${events.length === 1 ? 'event' : 'events'}`}</span></div>{loading ? <div className="event-grid"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div> : events.length ? <motion.div className="event-grid" layout><AnimatePresence mode="popLayout">{events.map((event) => <EventCard key={event.id} event={event} onRegister={setSelected} />)}</AnimatePresence></motion.div> : <EmptyState title="No matching events" message="Try a different search, category or time range." />}</div></section><RegistrationModal event={selected} onClose={() => setSelected(null)} /></main>
}
