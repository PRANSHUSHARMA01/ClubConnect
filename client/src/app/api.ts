import type { ApiError, EventRecord, RegistrationForm, RegistrationRecord, Stats } from '../types'

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(path, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options })
  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as ApiError
    const error = new Error(payload.error?.message || 'Request failed.') as Error & { code?: string; fields?: Record<string, string[]> }
    error.code = payload.error?.code
    error.fields = payload.error?.fields
    throw error
  }
  return response.status === 204 ? (undefined as T) : response.json()
}

const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('clubconnect_admin_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getEvents(params: { search?: string; category?: string; status?: string } = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value && value !== 'All') as [string, string][])
  return request<{ events: EventRecord[] }>(`/api/events${query.size ? `?${query}` : ''}`)
}
export async function getEvent(id: string) { return request<{ event: EventRecord }>(`/api/events/${id}`) }
export async function register(payload: RegistrationForm) { return request<{ registration: RegistrationRecord }>('/api/registrations', { method: 'POST', body: JSON.stringify(payload) }) }
export async function getStats() { return request<Stats>('/api/health').then(() => request<Stats>('/api/stats').catch(() => ({ totalEvents: 0, totalRegistrations: 0, upcomingEvents: 0, members: 842, workshops: 18 }))) }
export async function login(email: string, password: string) { return request<{ token: string; admin: { email: string } }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }) }
export async function createEvent(payload: Omit<EventRecord, 'id' | 'createdAt'>) { return request<{ event: EventRecord }>('/api/events', { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) }) }
export async function updateEvent(id: string, payload: Omit<EventRecord, 'id' | 'createdAt'>) { return request<{ event: EventRecord }>(`/api/events/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload) }) }
export async function deleteEvent(id: string) { return request<void>(`/api/events/${id}`, { method: 'DELETE', headers: authHeaders() }) }
export async function getRegistrations(params: { search?: string; eventId?: string } = {}) { const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value) as [string, string][]); return request<{ registrations: RegistrationRecord[] }>(`/api/registrations${query.size ? `?${query}` : ''}`, { headers: authHeaders() }) }
export function exportRegistrations(params: { search?: string; eventId?: string } = {}) { const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value) as [string, string][]); window.open(`/api/registrations/export.csv${query.size ? `?${query}` : ''}`, '_blank') }
