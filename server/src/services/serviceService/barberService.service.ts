import { prisma } from "../../db/prisma";

export async function retrieveServices(shopId: string) {
    const services = await prisma.service.findMany({
        where: { shopId }
    })

    return services;
}