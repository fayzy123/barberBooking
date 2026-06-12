import { createId } from "@paralleldrive/cuid2";
import { CreateBooking, RetrieveBooking } from "../../api/schemas/booking.schema";
import { prisma } from "../../db/prisma";
import { start } from "node:repl";


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
            Staff: { select: { firstName: true, lastName: true }}
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
            Staff: { select: { firstName: true, lastName: true } },
        },
    })

    if (!booking) {
        throw new Error("Booking not found")
    }

    return booking
}

// Helper function: Generates a unique 8 character uppercase booking ref
function generateRef() : string {
    return Math.random().toString(36).substring(2, 10).toUpperCase()
}

// Create a new booking
export async function postBooking(input : CreateBooking, shopId: string) {
    const service = await prisma.service.findUnique({
        where: { id: input.serviceId}
    })

    if (!service) {
        throw new Error('Service not found')
    }

    const startTime = new Date(input.startTime)
    // Converts minutes to milliseconds
    const endTime = new Date(startTime.getTime() + service.durationMinutes * 60 * 1000)

    // Generate unique id and ref
    const id = createId()
    const ref = generateRef()

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
        where: {
            staffId: input.staffId,
            status: "BOOKED",
            AND: [
                { startTime: { lt: endTime }},
                { endTime: { gt: startTime }}
            ]
        }
    })

    if (overlappingBooking) {
        throw new Error("Staff member already has a booking at this time")
    }

    // Check for availability against shift schedule
    await checkStaffAvailibility(input.staffId, startTime, endTime)
   
    return prisma.booking.create({ 
        data: {
            id,
            ref, 
            shopId,
            staffId: input.staffId,
            serviceId: input.serviceId,
            startTime,
            endTime,
            customerName: input.customerName,
            customerPhone: input.customerPhone,
            updatedAt: new Date()
        },
        include: {
            Service: { select: { name: true, durationMinutes: true } },
            Staff: { select: { firstName: true, lastName: true } }
        }
     })
}

// Cancel a booking
export async function cancelBooking(id : string, cancelReason?: string) {
    const booking = await getBookingById(id);

    if (booking.cancelledAt) {
        throw new Error("Booking has already been cancelled.")
    }

    return prisma.booking.update({ 
        where: { id },
        data: {
            status: "CANCELLED",
            cancelledAt: new Date(),
            cancelReason, 
            updatedAt: new Date(),
        }
     })
}

// Reassign booking to new staff member
export async function reassignBooking(id: string, staffId: string) {
    const booking = await getBookingById(id);
     if (booking.cancelledAt) {
        throw new Error("Booking has already been cancelled.")
    }
    
    const staff = await prisma.staff.findUnique({
        where: { id: staffId}
    })

    if (!staff) {
        throw new Error("Staff member not found")
    }

    return prisma.booking.update({ 
        where: { id },
        data: {
            staffId,
            updatedAt: new Date(),
        }
     })
}

// Helper Function to convert into minutes
function toMinutes(time: string): number {
    const [hours, mins] = time.split(':').map(Number)
    return hours * 60 + mins
}

// Helper function to check if staff is available
async function checkStaffAvailibility(staffId: string, startTime: Date, endTime: Date) {
    const dayMap: Record<number, string> = {
        0: 'sun', 1: 'mon', 2: 'tue',
        3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat'
    }

    const staff = await prisma.staff.findUnique({ where: { id: staffId } })
    if (!staff) throw new Error("Staff member not found")
    if (!staff.active) throw new Error("Staff member is not available at this time")
    
    const shift = await prisma.shift.findFirst({
        where: { staffId, day: dayMap[startTime.getDay()], active: true}
    })

    if (!shift) throw new Error("Staff member is not available at this time")
    const bookingStart = toMinutes(`${startTime.getHours()}:${startTime.getMinutes()}`)
    const bookingEnd = toMinutes(`${endTime.getHours()}:${endTime.getMinutes()}`)

    if (bookingStart < toMinutes(shift.startTime) || bookingEnd > toMinutes(shift.endTime)) {
        throw new Error("Staff member is not available at this time")
    }
}