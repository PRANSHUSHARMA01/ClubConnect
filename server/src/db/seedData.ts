import bcrypt from 'bcryptjs'
import type { EventRecord, RegistrationRecord } from '../types/domain.js'

export const seedEvents: EventRecord[] = [
  { id: 'evt-001', name: 'CodeSprint 2026', date: '2026-10-03', time: '10:00 AM – 4:00 PM', venue: 'Innovation Lab, ABES', description: 'A fast-paced algorithm sprint where teams turn sharp thinking into clean, working code.', category: 'Contest', imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', featured: true, attendees: 86, createdAt: '2026-09-01T09:00:00.000Z' },
  { id: 'evt-002', name: 'Build with APIs', date: '2026-10-10', time: '2:00 PM – 5:00 PM', venue: 'Seminar Hall 2', description: 'Ship your first production-minded API integration with Node, REST and a little curiosity.', category: 'Workshop', imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80', featured: false, attendees: 42, createdAt: '2026-09-02T09:00:00.000Z' },
  { id: 'evt-003', name: 'Open Source Office Hours', date: '2026-10-18', time: '11:00 AM – 1:00 PM', venue: 'Library Commons', description: 'Bring a repo, a question or a first issue. Mentors help you make your next open-source contribution.', category: 'Talk', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80', featured: false, attendees: 28, createdAt: '2026-09-03T09:00:00.000Z' },
  { id: 'evt-004', name: 'Frontend Forge', date: '2026-11-01', time: '10:30 AM – 3:30 PM', venue: 'Design Studio', description: 'A hands-on interface lab for making systems that feel intentional from first click to final pixel.', category: 'Workshop', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80', featured: false, attendees: 63, createdAt: '2026-09-04T09:00:00.000Z' },
  { id: 'evt-005', name: 'Hack the Campus', date: '2026-11-14', time: '9:00 AM – 9:00 PM', venue: 'ABES Main Atrium', description: 'Prototype a useful campus tool in one day with your crew, your stack and a deadline.', category: 'Hackathon', imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80', featured: false, attendees: 118, createdAt: '2026-09-05T09:00:00.000Z' },
  { id: 'evt-006', name: 'Git & Chai', date: '2026-09-12', time: '4:00 PM – 6:00 PM', venue: 'Student Lounge', description: 'An easygoing social for pairing, sharing and making the terminal feel a little friendlier.', category: 'Social', imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80', featured: false, attendees: 34, createdAt: '2026-08-20T09:00:00.000Z' },
  { id: 'evt-007', name: 'Competitive Coding Kickoff', date: '2026-09-06', time: '10:00 AM – 12:00 PM', venue: 'Computer Center', description: 'A practical start to problem solving patterns, contests and a healthier practice loop.', category: 'Talk', imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80', featured: false, attendees: 51, createdAt: '2026-08-14T09:00:00.000Z' }
]

export const seedRegistrations: RegistrationRecord[] = [
  { id: 'reg-001', eventId: 'evt-001', eventName: 'CodeSprint 2026', name: 'Aarav Sharma', email: 'aarav@example.com', college: 'ABES Engineering College', year: '3rd Year', phone: '9876543210', registeredAt: '2026-09-20T09:30:00.000Z' },
  { id: 'reg-002', eventId: 'evt-002', eventName: 'Build with APIs', name: 'Meera Joshi', email: 'meera@example.com', college: 'ABES Engineering College', year: '2nd Year', phone: '9123456780', registeredAt: '2026-09-21T11:10:00.000Z' },
  { id: 'reg-003', eventId: 'evt-005', eventName: 'Hack the Campus', name: 'Kabir Verma', email: 'kabir@example.com', college: 'AKGEC', year: '4th Year', phone: '9988776655', registeredAt: '2026-09-22T14:20:00.000Z' }
]

export const defaultAdmin = {
  id: 'admin-001',
  email: 'admin@club.com',
  passwordHash: bcrypt.hashSync('admin123', 10)
}
