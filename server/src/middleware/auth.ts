import jwt from 'jsonwebtoken'
import type { NextFunction, Request, Response } from 'express'

export type AuthenticatedRequest = Request & { user?: { id: string; email: string } }
const secret = () => process.env.JWT_SECRET || 'clubconnect-development-secret'

export function signAdminToken(user: { id: string; email: string }) {
  return jwt.sign(user, secret(), { expiresIn: '8h' })
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Admin authentication is required.' } })
  try {
    ;(req as AuthenticatedRequest).user = jwt.verify(token, secret()) as { id: string; email: string }
    next()
  } catch {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Your admin session has expired.' } })
  }
}
