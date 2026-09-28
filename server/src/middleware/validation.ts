import { z } from 'zod'
import type { ErrorRequestHandler, RequestHandler } from 'express'
import { EVENT_CATEGORIES } from '../types/domain.js'

export const eventSchema = z.object({
  name: z.string().trim().min(3).max(255),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().trim().min(2).max(64),
  venue: z.string().trim().min(2).max(255),
  description: z.string().trim().min(12).max(1200),
  category: z.enum(EVENT_CATEGORIES),
  imageUrl: z.string().url().max(1000),
  featured: z.boolean().default(false),
  attendees: z.number().int().min(0).max(100000).optional()
})

export const registrationSchema = z.object({
  eventId: z.string().min(1),
  name: z.string().trim().min(2).max(255),
  email: z.string().trim().email().max(255),
  college: z.string().trim().min(2).max(255),
  year: z.string().trim().min(1).max(32),
  phone: z.string().trim().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits.')
})

export const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(6) })

export const validateBody = (schema: z.ZodType): RequestHandler => (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Please check the highlighted fields.', fields: result.error.flatten().fieldErrors } })
  req.body = result.data
  next()
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong on the server.' } })
}
