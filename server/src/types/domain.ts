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

export type RegistrationRecord = {
  id: string
  eventId: string
  eventName: string
  name: string
  email: string
  college: string
  year: string
  phone: string
  registeredAt: string
}

export type EventFilters = {
  search?: string
  category?: string
  status?: 'upcoming' | 'past' | 'all'
}

export type EventInput = Omit<EventRecord, 'id' | 'createdAt' | 'attendees'> & { attendees?: number }

export type RegistrationInput = {
  eventId: string
  name: string
  email: string
  college: string
  year: string
  phone: string
}
