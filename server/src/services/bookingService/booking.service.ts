import { RetrieveBooking } from "../../api/schemas/booking.schema";
import { prisma } from "../../db/prisma";

// Retrieve all booking endpoint
export async function getBookings(filters : RetrieveBooking) {
    // Build the where clause conditionally
    const where: any = {}

    // Filter by date range
    if (filters.date) {
        const start = new Date(filters.date)
        start.setHours(0, 0, 0, 0)
        const end = new Date(filters.date)
        end.setHours(23, 59, 59, 999)
        // GTE = Greater than or equal
        where.startTime = { gte: start, lte: end }
    }

    // Filter by status if provided
    if (filters.status) {
        where.status = filters.status
    }

    // Filter by staff if provided
    if (filters.staffId) {
        where.staffId = filters.staffId
    }

    // 3. Query to return all booking with selected filters
    // Include brings in related data
    // Select displays only columns that are required
    return prisma.booking.findMany({
        where,
        include: {
            Service: { select: { name: true, durationMinutes: true } },
            Staff: { select: { name: true }}
        },
        orderBy: { startTime: 'asc'}
    })
}

// Retrieve bookings by ID
export async function getBookingById(id : string) {
    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            Service: { select: { name: true, durationMinutes: true } },
            Staff: { select: { name: true } },
        },
    })

    if (!booking) {
        throw new Error("Booking not found")
    }

    return booking
}
