import { Router } from 'express'
import type { DataStore } from '../db/store.js'
import { requireAdmin } from '../middleware/auth.js'
import { registrationSchema, validateBody } from '../middleware/validation.js'

const escapeCsv = (value: string) => `"${value.replaceAll('"', '""')}"`

export const registrationsRouter = (store: DataStore) => {
  const router = Router()
  router.post('/', validateBody(registrationSchema), async (req, res, next) => {
    try {
      const result = await store.createRegistration(req.body)
      if (result.error === 'event_not_found') return res.status(404).json({ error: { code: 'EVENT_NOT_FOUND', message: 'That event is no longer available.' } })
      if (result.error === 'duplicate') return res.status(409).json({ error: { code: 'DUPLICATE_REGISTRATION', message: 'This email is already registered for the event.' } })
      res.status(201).json({ registration: result.registration })
    } catch (error) { next(error) }
  })
  router.get('/', requireAdmin, async (req, res, next) => {
    try { res.json({ registrations: await store.listRegistrations({ search: String(req.query.search || ''), eventId: String(req.query.eventId || '') }) }) } catch (error) { next(error) }
  })
  router.get('/export.csv', requireAdmin, async (req, res, next) => {
    try {
      const registrations = await store.listRegistrations({ search: String(req.query.search || ''), eventId: String(req.query.eventId || '') })
      const rows = [['Name', 'Email', 'College', 'Year', 'Phone', 'Event', 'Registration time'], ...registrations.map((item) => [item.name, item.email, item.college, item.year, item.phone, item.eventName, item.registeredAt])]
      res.setHeader('Content-Type', 'text/csv; charset=utf-8')
      res.setHeader('Content-Disposition', 'attachment; filename="clubconnect-registrations.csv"')
      res.send(rows.map((row) => row.map(escapeCsv).join(',')).join('\n'))
    } catch (error) { next(error) }
  })
  return router
}
