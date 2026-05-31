import { Response } from "express";
import { AuthRequest } from "../../middleware/authenticate";
import { createService, retrieveServices, updateService } from "../services/barberService.service";
import { validateRequest } from "../../utils/validate";
import { CreateService, createServiceSchema, UpdateService, updateServiceSchema } from "../schemas/barberService.schema";

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

export async function addService(req: AuthRequest, res: Response) {
    const shopId = req.admin?.shopId
    if (!shopId) {
        res.status(401).json({ message: "Unauthorised" })
        return
    }

    const input = validateRequest<CreateService>(createServiceSchema, req.body, res);
    if (!input) return;

    try {
        const result = await createService(input, shopId)
        res.status(201).json(result)
    } catch (error : unknown) {
        const message = error instanceof Error ? error.message : "Error";
        res.status(500).json({ message })
    }
}

export async function editService(req: AuthRequest, res: Response) {
    const shopId = req.admin?.shopId
    if (!shopId) {
        res.status(401).json({ message: "Unauthorised" })
        return
    }

    const { id } = req.params;
    const input = validateRequest<UpdateService>(updateServiceSchema, req.body, res);
    if (!input) return;

    try {
        const result = await updateService(id, input)
        res.status(200).json(result)
    } catch (error : unknown) {
        const message = error instanceof Error ? error.message : "Error"
        const status = message === 'Service not found' ? 404 : 500
        res.status(status).json({ message })
    }
}