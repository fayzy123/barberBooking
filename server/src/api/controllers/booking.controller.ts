import { Request, Response } from "express";
import { getBookingById, getBookings, postBooking } from "../../services/bookingService/booking.service";
import { bookingQuerySchema, CreateBooking, createBookingSchema } from "../schemas/booking.schema";
import { validateRequest } from "../../utils/validate";
import { unknown } from "zod";
import { authenticate, AuthRequest } from "../../middleware/authenticate";

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
    } catch (error : unknown) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(500).json({ message })
    }
}