export interface BookingRequest {
  fullName: string
  email: string
  phone?: string
  projectType?: string
  budget?: string
  message?: string
  date: string // ISO date string
  timeSlot: string
  honeypot?: string // Anti-bot field
}

export interface BookingResponse {
  ok: boolean
  bookingId?: string
  message?: string
  errors?: Record<string, string[]>
}

export interface Booking {
  id: string
  fullName: string
  email: string
  phone: string | null
  projectType: string | null
  budget: string | null
  message: string | null
  date: Date
  timeSlot: string
  createdAt: Date
  status: string
}



