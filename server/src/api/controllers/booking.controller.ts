import { Request, Response } from "express";
import { getBookingById, getBookings, postBooking, cancelBooking as cancelBookingService, reassignBooking, fetchAvailableSlots, updateBooking } from "../services/booking.service";
import { bookingQuerySchema, CreateBooking, createBookingSchema, UpdateBooking, updateBookingSchema } from "../schemas/booking.schema";
import { validateRequest } from "../../utils/validate";
import { AuthRequest } from "../../middleware/authenticate";

// Refactor task: shopID check is being repeated in routes

export async function retrieveBookings(req: Request, res: Response) {
    // If validation fails, tell client what went wrong using validation helper
    const data = validateRequest(bookingQuerySchema, req.query, res)
    if (!data) return

    try {
        const result = await getBookings(data)
        // If login is successful 
        res.status(200).json(result)
    } catch (error : unknown) {
        // Catch any errors
        const message = error instanceof Error ? error.message : "Error";
        res.status(500).json({ message })
    }
}

export async function retrieveBookingById(req: Request, res: Response) {
    const { id } = req.params

    try {
        const result = await getBookingById(id)
        res.status(200).json(result)
    } catch (error : unknown) {
        const message = error instanceof Error ? error.message : "Error"
        const status = message === 'Booking not found' ? 404 : 500
        res.status(status).json({message})
    }
}

export async function createBooking(req: AuthRequest, res: Response) {
    const shopId = req.admin?.shopId
    if (!shopId) {
        res.status(401).json({ message: "Unauthorised" })
        return
    }

    const input = validateRequest<CreateBooking>(createBookingSchema, req.body, res)
    if (!input) return

    try { 
        const result = await postBooking(input, shopId)
        res.status(201).json(result)
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error"
        const knownErrors = ['STAFF_INACTIVE', 'SERVICE_INACTIVE', 'NO_SHIFT', 'DURING_BREAK', 'SLOT_TAKEN', 'INVALID_REQUEST']
        const status = knownErrors.includes(message) ? 409 : 500
        res.status(status).json({ error: message })
    }
}

export async function editBooking(req: AuthRequest, res: Response) {
    const shopId = req.admin?.shopId
    if (!shopId) {
        res.status(401).json({ message: "Unauthorised" })
        return
    }
    
    const { id } = req.params
    const input = validateRequest<UpdateBooking>(updateBookingSchema, req.body, res)
    if (!input) return

    try {
        const result = await updateBooking(id, input)
        res.status(200).json(result)
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error"
        const knownErrors = ['STAFF_INACTIVE', 'SERVICE_INACTIVE', 'NO_SHIFT', 'DURING_BREAK', 'SLOT_TAKEN', 'INVALID_REQUEST']
        const status = knownErrors.includes(message) ? 409 : 500
        res.status(status).json({ error: message })
    }
}

export async function cancelBooking(req: AuthRequest, res: Response) {
    const shopId = req.admin?.shopId
    if (!shopId) {
        res.status(401).json({ message: "Unauthorised" })
        return
    }
   
    const { id } = req.params
    const { cancelReason } = req.body

    try {
        const result = await cancelBookingService(id, cancelReason);
        res.status(200).json(result);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error"
        const status = message === 'Booking not found' ? 404 : 500
        res.status(status).json({message})
    }
}

export async function reassignStaff(req: AuthRequest, res: Response) {
    const shopId = req.admin?.shopId
    if (!shopId) {
        res.status(401).json({ message: "Unauthorised" })
        return;
    }

    const { id } = req.params
    const { staffId } = req.body

    try {
        const result = await reassignBooking(id, staffId);
        res.status(200).json(result);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error"
        const knownErrors = ['STAFF_INACTIVE', 'SERVICE_INACTIVE', 'NO_SHIFT', 'DURING_BREAK', 'SLOT_TAKEN', 'INVALID_REQUEST']
        const status = knownErrors.includes(message) ? 409 : 500
        res.status(status).json({ error: message })
    }
}

export async function getAvailableSlots(req: AuthRequest, res: Response) {
     const shopId = req.admin?.shopId
    if (!shopId) {
        res.status(401).json({ message: "Unauthorised" })
        return;
    }

    const { staffId, serviceId, date } = req.query as Record<string, string>

    if (!staffId || !serviceId || !date) {
        res.status(400).json({ message: "staffId, serviceId and date are required."})
        return
    }

    try {
        const result = await fetchAvailableSlots(shopId, staffId, serviceId, date)
        res.status(200).json(result)
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error"
        const knownErrors = [
            'STAFF_INACTIVE', 
            'NO_SHIFT', 
            'NO_SLOTS', 
            'PAST_DATE',
            'OUT_OF_RANGE',
            'INVALID_REQUEST',
            'SERVICE_INACTIVE'
         ]
        const status = knownErrors.includes(message) ? 400 : 500;
        res.status(status).json({ error: message })
    }
}