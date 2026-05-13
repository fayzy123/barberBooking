import { Request, Response } from "express";
import { getStaffById, retrieveStaff } from "../../services/staffService/staff.service";
import { AuthRequest } from "../../middleware/authenticate";

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
        const status = message === "Not staff found for this shop" ? 404 : 500
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