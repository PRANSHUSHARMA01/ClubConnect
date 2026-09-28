import { Router } from 'express'
import type { DataStore } from '../db/store.js'
import { requireAdmin } from '../middleware/auth.js'
import { eventSchema, validateBody } from '../middleware/validation.js'

export const eventsRouter = (store: DataStore) => {
  const router = Router()
  router.get('/', async (req, res, next) => {
    try {
      const events = await store.listEvents({ search: String(req.query.search || ''), category: String(req.query.category || ''), status: ['upcoming', 'past', 'all'].includes(String(req.query.status)) ? String(req.query.status) as 'upcoming' | 'past' | 'all' : 'all' })
      res.json({ events })
    } catch (error) { next(error) }
  })
  router.get('/:id', async (req, res, next) => {
    try { const event = await store.getEvent(String(req.params.id)); event ? res.json({ event }) : res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Event not found.' } }) } catch (error) { next(error) }
  })
  router.post('/', requireAdmin, validateBody(eventSchema), async (req, res, next) => {
    try { res.status(201).json({ event: await store.createEvent(req.body) }) } catch (error) { next(error) }
  })
  router.put('/:id', requireAdmin, validateBody(eventSchema), async (req, res, next) => {
    try { const event = await store.updateEvent(String(req.params.id), req.body); event ? res.json({ event }) : res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Event not found.' } }) } catch (error) { next(error) }
  })
  router.delete('/:id', requireAdmin, async (req, res, next) => {
    try { const deleted = await store.deleteEvent(String(req.params.id)); deleted ? res.status(204).end() : res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Event not found.' } }) } catch (error) { next(error) }
  })
  return router
}
