import { createId } from "@paralleldrive/cuid2";
import { CreateBooking, RetrieveBooking, UpdateBooking } from "../../api/schemas/booking.schema";
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

    const startTime = new Date(input.startTime)
    // Converts minutes to milliseconds
    const endTime = new Date(startTime.getTime() + service!.durationMinutes * 60 * 1000)

    // Generate unique id and ref
    const id = createId()
    const ref = generateRef()

   await validateBookingConstraints(input.staffId, input.serviceId, startTime, endTime)

    return prisma.booking.create({ 
        data: {
            id,
            ref, 
            shopId,
            staffId: input.staffId,
            serviceId: input.serviceId,
            startTime,
            endTime,
            customerFirstName: input.customerFirstName,
            customerLastName: input.customerLastName,
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
    
    await validateBookingConstraints(staffId, booking.serviceId, booking.startTime, booking.endTime, id)

    return prisma.booking.update({ 
        where: { id },
        data: {
            staffId,
            updatedAt: new Date(),
        }
     })
}

// Update booking to enable full field editing
export async function updateBooking(id: string, input: UpdateBooking) {
    const booking = await getBookingById(id);
    
    if (booking.cancelledAt) {
        throw new Error("Booking has already been cancelled.")
    }

    let newEndTime = booking.endTime

    if (input.serviceId) {
        const service = await prisma.service.findUnique({ where: { id: input.serviceId }})
        if (!service) throw new Error("INVALID_REQUEST")

        // Recalculate endTime based on existing startTime + new service duration
        newEndTime = new Date(booking.startTime.getTime() + service.durationMinutes * 60 * 1000)

        // Check for overlaps with new endTime
        await validateBookingConstraints(booking.staffId, input.serviceId, booking.startTime, newEndTime, id)
    }

    return prisma.booking.update({
        where: { id },
        data: {
            ...input,
            endTime: newEndTime,
            updatedAt: new Date()
        }
    })
}

// Fetch Available slots
export async function fetchAvailableSlots(
    shopId: string,
    staffId: string,
    serviceId: string,
    date: string,
) {
    const [shop, staff, service] = await Promise.all([
        prisma.shop.findFirst({where: {id: shopId}}),
        prisma.staff.findUnique({where: {id: staffId}}),
        prisma.service.findUnique({where: {id: serviceId}}),
    ])

    // Check all records exist
    if (!shop || !staff || !service) {
        throw new Error('INVALID_REQUEST')
    }

    if (!staff.active) {
        throw new Error('STAFF_INACTIVE')
    }

    if (!service.active) {
        throw new Error('SERVICE_INACTIVE')
    }

    // Check date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0)
    const selectedDate = new Date(date);

    if (selectedDate < today) {
        throw new Error('PAST_DATE');
    }

    // Check date is within bookAheadDays
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + shop.bookAheadDays)

    if (selectedDate > maxDate) {
        throw new Error('OUT_OF_RANGE')
    }

    // Get day of week from selected date
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const daysOfWeek = days[selectedDate.getDay()]

    // Find the shift for that day
    const shift = await prisma.shift.findFirst({
        where: {
            staffId,
            day: daysOfWeek,
            active: true
        }
    })

    if (!shift) {
        throw new Error("NO_SHIFT")
    }

    // Fetch existing bookings for this staff on the selected date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await prisma.booking.findMany({
        where: {
            staffId,
            status: "BOOKED",
            startTime: {
                gte: startOfDay,
                lte: endOfDay
            }
        }
    })

    const slots = generateSlots(
        date, 
        shift.startTime, 
        shift.endTime, 
        shop.slotInterval, 
        shop.leadTime, 
        service.durationMinutes, 
        existingBookings,
        shop.closeTime,
        shift.breakStart,
        shift.breakDuration
    )
    
    if (slots.length === 0) {
        throw new Error('NO_SLOTS')
    }

    return { slots }
}

// Helper function to generate slots
export function generateSlots(
    date: string,
    shiftStart: string,
    shiftEnd: string,
    slotInterval: number,
    leadTime: number,
    serviceDuration: number,
    existingBookings: { startTime: Date; endTime: Date}[],
    shopCloseTime: string,
    breakStart?: string | null | undefined,
    breakDuration?: number | null | undefined,
): string[] {

    const slots: string[] = []
    const now = new Date()
    const isToday = new Date(date).toDateString() === now.toDateString()
    const current = new Date(`${date}T${shiftStart}:00`)
    const shiftEndTime = new Date(`${date}T${shiftEnd}:00`)
    const closeTime = new Date(`${date}T${shopCloseTime}:00`)
    const effectiveEndTime = shiftEndTime < closeTime ? shiftEndTime : closeTime;
     
    while (current < effectiveEndTime) {
        const slotEnd = new Date(current)
        slotEnd.setMinutes(slotEnd.getMinutes() + serviceDuration)

        // Slot must fit within the shift
        if (slotEnd > effectiveEndTime) break

        // Skip if too close to now
        const minsFromNow = (current.getTime() - now.getTime()) / 60000;
        if (isToday && minsFromNow < leadTime) {
            current.setMinutes(current.getMinutes() + slotInterval)
            continue
        }

        // Skip if overlaps existing booking or staff is on break
        const isOverlapping = existingBookings.some(b =>
            current < b.endTime && slotEnd > b.startTime
        )

        const isDuringBreak = overlapsBreak(current, slotEnd, breakStart, breakDuration, date)

        if (!isOverlapping && !isDuringBreak) {
            slots.push(current.toTimeString().slice(0, 5))
        }

        current.setMinutes(current.getMinutes() + slotInterval)
     }
     return slots;
}

// Helper function to validate booking contraints
async function validateBookingConstraints(
    staffId: string,
    serviceId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string
) {
    const [staff, service] = await Promise.all([
        prisma.staff.findUnique({ where: { id: staffId } }),
        prisma.service.findUnique({ where: { id: serviceId } })
    ])

    if (!staff) throw new Error('INVALID_REQUEST')
    if (!staff.active) throw new Error('STAFF_INACTIVE')

    if (!service) throw new Error('INVALID_REQUEST')
    if (!service.active) throw new Error('SERVICE_INACTIVE')

    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const dayOfWeek = days[startTime.getDay()]
    const shift = await prisma.shift.findFirst({
        where: { staffId, day: dayOfWeek, active: true }
    })

    if (!shift) throw new Error('NO_SHIFT')
    
    const dateStr = startTime.toISOString().slice(0, 10)
    if (overlapsBreak(startTime, endTime, shift.breakStart, shift.breakDuration, dateStr)) {
        throw new Error('DURING_BREAK')
    }

    const overlappingBooking = await prisma.booking.findFirst({
        where: {
            staffId,
            status: 'BOOKED',
            ...(excludeBookingId && { id: { not: excludeBookingId } }),
            AND: [
                { startTime: { lt: endTime } },
                { endTime: { gt: startTime } }
            ]
        }
    })

    if (overlappingBooking) throw new Error('SLOT_TAKEN')
}

// Helper function to check if staff is on break
function overlapsBreak(
    windowStart: Date,
    windowEnd: Date,
    breakStart: string | null | undefined,
    breakDuration: number | null | undefined,
    dateStr: string
): boolean {
    if (!breakStart) return false

    const breakStartTime = new Date(`${dateStr}T${breakStart}:00`)
    const breakEndTime = new Date(breakStartTime.getTime() + (breakDuration ?? 60) * 60 * 1000)

    return windowStart < breakEndTime && windowEnd > breakStartTime
}