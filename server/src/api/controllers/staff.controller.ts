import { Request, Response } from "express";
import { createStaff, getStaffById, retrieveStaff, updateAvailability, updateStaff } from "../services/staff.service";
import { AuthRequest } from "../../middleware/authenticate";
import { validateRequest } from "../../utils/validate";
import { CreateStaff, createStaffSchema, updateAvailabilitySchema, UpdateStaff, UpdateStaffAvailability, updateStaffSchema } from "../schemas/staff.schema";

export async function retrieveAllStaff(req: AuthRequest, res: Response) {
    const shopId = req.admin?.shopId
    if (!shopId) {
        res.status(401).json({ message: "Unauthorised" })
        return
    }

    try {
        const result = await retrieveStaff(shopId)
        res.status(200).json(result)
    } catch (error : unknown) {
        const message = error instanceof Error ? error.message : "Error"
        const status = message === "No staff found for this shop" ? 404 : 500
        res.status(status).json({message})
    }
}

export async function retrieveStaffById(req: Request, res: Response) {
    const { id } = req.params

    try {
        const result = await getStaffById(id)
        res.status(200).json(result)
    } catch (error : unknown) {
        const message = error instanceof Error ? error.message : "Error"
        const status = message === "Staff member not found" ? 404 : 500
        res.status(status).json({message})
    }
}

export async function addStaff(req: AuthRequest, res: Response) {
    const shopId = req.admin?.shopId
    if (!shopId) {
        res.status(401).json({ message: "Unauthorised"})
        return;
    }

    const input = validateRequest<CreateStaff>(createStaffSchema, req.body, res)
    if (!input) return;

    try {
        const result = await createStaff(input, shopId);
        res.status(201).json(result)
    } catch(error : unknown) {
        const message = error instanceof Error ? error.message : "Error"
        res.status(500).json({ message })
    }
}

export async function editStaff(req: AuthRequest, res: Response) {
    const shopId = req.admin?.shopId
    if (!shopId) {
        res.status(401).json({ message: "Unauthorised" })
        return;
    }

    const { id } = req.params;
    const input = validateRequest<UpdateStaff>(updateStaffSchema, req.body, res)
    if (!input) return;

    try {
        const result = await updateStaff(id, input);
        res.status(200).json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        const status = message === "Staff not found!" ? 404 : 500
        res.status(status).json({ message })
    }
}

export async function editAvailability(req: AuthRequest, res: Response) {
    const shopId = req.admin?.shopId
    if (!shopId) {
        res.status(401).json({ message: "Unauthorised" })
        return;
    }

    const { id } = req.params;
    const input = validateRequest<UpdateStaffAvailability>(updateAvailabilitySchema, req.body, res)
    if (!input) return;

    try {
        const result = await updateAvailability(id, input.availability);
        res.status(200).json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        const status = message === "Staff not found!" ? 404 : 500;
        res.status(status).json({ message })
    }
}