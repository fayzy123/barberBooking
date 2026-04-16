import { z } from 'zod';

// Validate the booking POST request
export const createBookingSchema = z.object({
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    customerName: z.string(),
    customerPhone: z.string().min(10).max(13).startsWith("+44").trim(),
    serviceId: z.string(),
    staffId: z.string()
})

// Validate the fetching of bookings GET request
export const bookingQuerySchema = z.object({
    date: z.string().date().optional(),
    status: z.enum(["BOOKED", "CANCELLED"]).optional(),
    staffId: z.string().optional()
})

export type CreateBooking = z.infer<typeof createBookingSchema>
export type RetrieveBooking = z.infer<typeof bookingQuerySchema>