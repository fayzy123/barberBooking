import { Response } from "express";
import { getShop, updateShop } from "../services/shop.service";
import { AuthRequest } from "../../middleware/authenticate";
import { validateRequest } from "../../utils/validate";
import { UpdateShop, updateShopSchema } from "../schemas/shop.schema";

export async function retrieveShop(req: AuthRequest, res: Response) {
    const shopId = req.admin?.shopId
    
    if (!shopId) {
        res.status(401).json({ message: "Unauthorised" })
        return
    }

    try {
        const result = await getShop(shopId);
        res.status(200).json(result)
    } catch (error : unknown) {
        const message = error instanceof Error ? error.message : "Error"
        const status = message === "No shop found" ? 404 : 500
        res.status(status).json({message})
    }
}

export async function editShop(req: AuthRequest, res: Response) {
    const shopId = req.admin?.shopId
    
    if (!shopId) {
        res.status(401).json({ message: "Unauthorised" })
        return;
    }

    const input = validateRequest<UpdateShop>(updateShopSchema, req.body, res)
    if (!input) return

    try {
        const result = await updateShop(shopId, input)
        res.status(200).json(result);
    } catch (error : unknown) {
        const message = error instanceof Error ? error.message : "Error"
        const status = message === "No shop found" ? 404 : 500
        res.status(status).json({message})
    }
}