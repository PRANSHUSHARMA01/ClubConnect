export const EVENT_CATEGORIES = ['Workshop', 'Hackathon', 'Contest', 'Talk', 'Social'] as const
export type EventCategory = (typeof EVENT_CATEGORIES)[number]

export type EventRecord = {
  id: string
  name: string
  date: string
  time: string
  venue: string
  description: string
  category: EventCategory
  imageUrl: string
  featured: boolean
  attendees: number
  createdAt: string
}

export type RegistrationForm = { eventId: string; name: string; email: string; college: string; year: string; phone: string }
export type RegistrationRecord = RegistrationForm & { id: string; eventName: string; registeredAt: string }
export type Stats = { totalEvents: number; totalRegistrations: number; upcomingEvents: number; members: number; workshops: number }
export type ApiError = { error?: { code?: string; message?: string; fields?: Record<string, string[]> } }
