import { prisma } from "../../db/prisma";
import { UpdateShop } from "../schemas/shop.schema";

export async function getShop (shopId: string) {
    const shop = await prisma.shop.findUnique({
        where:  { id: shopId }
    })

    return shop
}

export async function updateShop (shopId: string, input: UpdateShop) {
    return prisma.shop.update({
        where: { id: shopId },
        data: { 
            ...input,
            updatedAt: new Date()
        }
    })
}