import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import type { Pool, RowDataPacket } from 'mysql2/promise'
import { defaultAdmin, seedEvents, seedRegistrations } from './seedData.js'
import type { EventFilters, EventInput, EventRecord, RegistrationInput, RegistrationRecord } from '../types/domain.js'

type EventRow = RowDataPacket & { id: string; name: string; event_date: string; event_time: string; venue: string; description: string; category: EventRecord['category']; image_url: string; featured: number | boolean; attendees: number; created_at: string }
type RegistrationRow = RowDataPacket & { id: string; event_id: string; event_name: string; name: string; email: string; college: string; year: string; phone: string; registered_at: string }

const iso = (value: string | Date) => new Date(value).toISOString()
const dateOnly = (value: string | Date) => value instanceof Date ? value.toISOString().slice(0, 10) : value.slice(0, 10)

export class DataStore {
  private pool?: Pool
  private events = structuredClone(seedEvents)
  private registrations = structuredClone(seedRegistrations)
  private admin = defaultAdmin

  async init() {
    if (!process.env.DATABASE_URL) return
    this.pool = mysql.createPool(process.env.DATABASE_URL)
    const schema = fs.readFileSync(path.resolve(process.cwd(), 'server/src/db/schema.sql'), 'utf8')
    for (const statement of schema.split(';').map((part) => part.trim()).filter(Boolean)) await this.pool.query(statement)
    await this.pool.query('INSERT IGNORE INTO admins (id, email, password_hash, created_at) VALUES (?, ?, ?, NOW())', [defaultAdmin.id, defaultAdmin.email, defaultAdmin.passwordHash])
    for (const event of seedEvents) {
      await this.pool.query('INSERT IGNORE INTO events (id, name, event_date, event_time, venue, description, category, image_url, featured, attendees, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [event.id, event.name, event.date, event.time, event.venue, event.description, event.category, event.imageUrl, event.featured, event.attendees, event.createdAt.slice(0, 19).replace('T', ' ')])
    }
    for (const registration of seedRegistrations) {
      await this.pool.query('INSERT IGNORE INTO registrations (id, event_id, name, email, college, year, phone, registered_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [registration.id, registration.eventId, registration.name, registration.email, registration.college, registration.year, registration.phone, registration.registeredAt.slice(0, 19).replace('T', ' ')])
    }
    await this.pool.query('INSERT IGNORE INTO seed_versions (version, applied_at) VALUES (?, NOW())', ['clubconnect-seed-v1'])
  }

  async close() { await this.pool?.end() }
  get isPersistent() { return Boolean(this.pool) }

  private mapEvent(row: EventRow): EventRecord {
    return { id: row.id, name: row.name, date: dateOnly(row.event_date), time: row.event_time, venue: row.venue, description: row.description, category: row.category, imageUrl: row.image_url, featured: Boolean(row.featured), attendees: Number(row.attendees), createdAt: iso(row.created_at) }
  }

  private mapRegistration(row: RegistrationRow): RegistrationRecord {
    return { id: row.id, eventId: row.event_id, eventName: row.event_name, name: row.name, email: row.email, college: row.college, year: row.year, phone: row.phone, registeredAt: iso(row.registered_at) }
  }

  async listEvents(filters: EventFilters = {}) {
    if (!this.pool) {
      const now = new Date().toISOString().slice(0, 10)
      return this.events.filter((event) => (!filters.search || event.name.toLowerCase().includes(filters.search.toLowerCase())) && (!filters.category || filters.category === 'All' || event.category === filters.category) && (!filters.status || filters.status === 'all' || (filters.status === 'upcoming' ? event.date >= now : event.date < now))).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    }
    const clauses: string[] = []
    const values: unknown[] = []
    if (filters.search) { clauses.push('name LIKE ?'); values.push(`%${filters.search}%`) }
    if (filters.category && filters.category !== 'All') { clauses.push('category = ?'); values.push(filters.category) }
    if (filters.status === 'upcoming') clauses.push('event_date >= CURDATE()')
    if (filters.status === 'past') clauses.push('event_date < CURDATE()')
    const [rows] = await this.pool.query<EventRow[]>(`SELECT * FROM events ${clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''} ORDER BY event_date ASC, event_time ASC`, values)
    return rows.map((row) => this.mapEvent(row))
  }

  async getEvent(id: string) {
    if (!this.pool) return this.events.find((event) => event.id === id)
    const [rows] = await this.pool.query<EventRow[]>('SELECT * FROM events WHERE id = ?', [id])
    return rows[0] ? this.mapEvent(rows[0]) : undefined
  }

  async createEvent(input: EventInput) {
    const event: EventRecord = { ...input, id: `evt-${crypto.randomUUID().slice(0, 8)}`, createdAt: new Date().toISOString(), attendees: input.attendees ?? 0 }
    if (event.featured) await this.clearFeatured()
    if (!this.pool) { this.events.push(event); return event }
    await this.pool.query('INSERT INTO events (id, name, event_date, event_time, venue, description, category, image_url, featured, attendees, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [event.id, event.name, event.date, event.time, event.venue, event.description, event.category, event.imageUrl, event.featured, event.attendees, event.createdAt.slice(0, 19).replace('T', ' ')])
    return event
  }

  async updateEvent(id: string, input: EventInput) {
    const existing = await this.getEvent(id)
    if (!existing) return undefined
    const event: EventRecord = { ...existing, ...input, id, createdAt: existing.createdAt, attendees: input.attendees ?? existing.attendees }
    if (event.featured) await this.clearFeatured(id)
    if (!this.pool) { this.events = this.events.map((item) => item.id === id ? event : item); return event }
    await this.pool.query('UPDATE events SET name=?, event_date=?, event_time=?, venue=?, description=?, category=?, image_url=?, featured=?, attendees=? WHERE id=?', [event.name, event.date, event.time, event.venue, event.description, event.category, event.imageUrl, event.featured, event.attendees, id])
    return event
  }

  async deleteEvent(id: string) {
    if (!this.pool) { const before = this.events.length; this.events = this.events.filter((event) => event.id !== id); this.registrations = this.registrations.filter((registration) => registration.eventId !== id); return this.events.length < before }
    const [result] = await this.pool.query<mysql.ResultSetHeader>('DELETE FROM events WHERE id = ?', [id])
    return result.affectedRows > 0
  }

  private async clearFeatured(exceptId?: string) {
    if (!this.pool) { this.events = this.events.map((event) => event.id === exceptId ? event : { ...event, featured: false }); return }
    await this.pool.query(`UPDATE events SET featured = FALSE ${exceptId ? 'WHERE id <> ?' : ''}`, exceptId ? [exceptId] : [])
  }

  async createRegistration(input: RegistrationInput) {
    const event = await this.getEvent(input.eventId)
    if (!event) return { error: 'event_not_found' as const }
    const email = input.email.toLowerCase()
    const duplicate = this.registrations.some((registration) => registration.eventId === input.eventId && registration.email === email)
    if (!this.pool && duplicate) return { error: 'duplicate' as const }
    const registration: RegistrationRecord = { id: `reg-${crypto.randomUUID().slice(0, 8)}`, eventId: event.id, eventName: event.name, name: input.name, email, college: input.college, year: input.year, phone: input.phone, registeredAt: new Date().toISOString() }
    if (!this.pool) { this.registrations.push(registration); this.events = this.events.map((item) => item.id === event.id ? { ...item, attendees: item.attendees + 1 } : item); return { registration } }
    try {
      await this.pool.query('INSERT INTO registrations (id, event_id, name, email, college, year, phone, registered_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [registration.id, registration.eventId, registration.name, registration.email, registration.college, registration.year, registration.phone, registration.registeredAt.slice(0, 19).replace('T', ' ')])
      await this.pool.query('UPDATE events SET attendees = attendees + 1 WHERE id = ?', [event.id])
      return { registration }
    } catch (error: any) { if (error?.code === 'ER_DUP_ENTRY') return { error: 'duplicate' as const }; throw error }
  }

  async listRegistrations(filters: { search?: string; eventId?: string } = {}) {
    if (!this.pool) return this.registrations.filter((registration) => (!filters.search || `${registration.name} ${registration.email}`.toLowerCase().includes(filters.search.toLowerCase())) && (!filters.eventId || registration.eventId === filters.eventId)).sort((a, b) => b.registeredAt.localeCompare(a.registeredAt))
    const clauses: string[] = []
    const values: unknown[] = []
    if (filters.search) { clauses.push('(r.name LIKE ? OR r.email LIKE ?)'); values.push(`%${filters.search}%`, `%${filters.search}%`) }
    if (filters.eventId) { clauses.push('r.event_id = ?'); values.push(filters.eventId) }
    const [rows] = await this.pool.query<RegistrationRow[]>(`SELECT r.*, e.name AS event_name FROM registrations r JOIN events e ON e.id = r.event_id ${clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''} ORDER BY r.registered_at DESC`, values)
    return rows.map((row) => this.mapRegistration(row))
  }

  async stats() {
    const events = await this.listEvents({ status: 'all' })
    const registrations = await this.listRegistrations()
    const upcoming = await this.listEvents({ status: 'upcoming' })
    return { totalEvents: events.length, totalRegistrations: registrations.length, upcomingEvents: upcoming.length, members: 842, workshops: events.filter((event) => event.category === 'Workshop').length + 18 }
  }

  async verifyAdmin(email: string, password: string) {
    if (!this.pool) return email === this.admin.email && bcrypt.compareSync(password, this.admin.passwordHash) ? { id: this.admin.id, email: this.admin.email } : undefined
    const [rows] = await this.pool.query<RowDataPacket[]>('SELECT id, email, password_hash FROM admins WHERE email = ?', [email])
    const admin = rows[0]
    return admin && await bcrypt.compare(password, String(admin.password_hash)) ? { id: String(admin.id), email: String(admin.email) } : undefined
  }
}
