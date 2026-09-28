import { Router } from 'express'
import type { DataStore } from '../db/store.js'
import { signAdminToken } from '../middleware/auth.js'
import { loginSchema, validateBody } from '../middleware/validation.js'

export const authRouter = (store: DataStore) => {
  const router = Router()
  router.post('/login', validateBody(loginSchema), async (req, res, next) => {
    try {
      const admin = await store.verifyAdmin(req.body.email, req.body.password)
      if (!admin) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'That email or password is not correct.' } })
      res.json({ token: signAdminToken(admin), admin })
    } catch (error) { next(error) }
  })
  return router
}
