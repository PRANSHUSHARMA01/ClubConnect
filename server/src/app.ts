import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { DataStore } from './db/store.js'
import { authRouter } from './routes/auth.js'
import { eventsRouter } from './routes/events.js'
import { registrationsRouter } from './routes/registrations.js'
import { errorHandler } from './middleware/validation.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const clientDist = path.join(rootDir, 'client/dist')
const clientPublic = path.join(rootDir, 'client/public')
const app = express()
const store = new DataStore()

app.disable('x-powered-by')
app.use(cors({ origin: true, credentials: false }))
app.use(express.json({ limit: '1mb' }))
app.use('/api', (_req, res, next) => { res.setHeader('Cache-Control', 'private, no-store'); next() })
app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: store.isPersistent ? 'managed' : 'preview', timestamp: new Date().toISOString() }))
app.get('/manus-routes.json', (_req, res) => res.sendFile(path.join(clientPublic, 'manus-routes.json')))
app.use('/api/auth', authRouter(store))
app.use('/api/events', eventsRouter(store))
app.get('/api/stats', async (_req, res, next) => { try { res.json(await store.stats()) } catch (error) { next(error) } })
app.use('/api/registrations', registrationsRouter(store))

app.use('/assets', express.static(path.join(clientDist, 'assets'), { maxAge: process.env.NODE_ENV === 'production' ? '1y' : 0, immutable: process.env.NODE_ENV === 'production' }))
app.use(express.static(clientDist, { maxAge: 0, index: false }))
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return next()
  res.sendFile(path.join(clientDist, 'index.html'), (error) => error && next(error))
})
app.use((_req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found.' } }))
app.use(errorHandler)

const port = Number(process.env.PORT || 3000)
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'clubconnect-production-secret-key-32charsmin'
}
await store.init()

if (!process.env.VERCEL) {
  app.listen(port, '0.0.0.0', () => console.log(`ClubConnect server listening on 0.0.0.0:${port}`))
}

export default app
