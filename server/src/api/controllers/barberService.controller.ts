import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/authenticate";
import { retrieveServices } from "../../services/serviceService/barberService.service";

export async function getAllServices(req: AuthRequest, res: Response) {
    const shopId = req.admin?.shopId
    if (!shopId) {
        res.status(401).json({ message: "Unauthorised" })
        return
    }

    try {
        const result = await retrieveServices(shopId)
        res.status(200).json(result)
    } catch (error : unknown) {
        const message = error instanceof Error ? error.message : "Error"
        const status = message === 'Booking not found' ? 404 : 500
        res.status(status).json({message})
    }
}