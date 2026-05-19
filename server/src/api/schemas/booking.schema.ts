import { z } from 'zod';

// Validate the booking POST request
export const createBookingSchema = z.object ({
    customerName: z.string().min(3, "Please enter a valid customer name"),
    customerPhone: z.string()
                    .min(10, "Invalid Phone number")
                    .max(13, "Invalid Phone number")
                    .regex(/^(\+44|0)[0-9]{9,10}$/, "Please enter a valid UK phone number")
                    .trim(),
    serviceId: z.string().min(1, "Please select a service"),
    staffId: z.string().min(1, "Please select a staff member"),
    startTime: z.string().min(1, "Please select a time")
})

// Validate the fetching of bookings GET request
export const bookingQuerySchema = z.object({
    date: z.string().date().optional(),
    status: z.enum(["BOOKED", "CANCELLED"]).optional(),
    staffId: z.string().optional()
})

export type CreateBooking = z.infer<typeof createBookingSchema>
export type RetrieveBooking = z.infer<typeof bookingQuerySchema>