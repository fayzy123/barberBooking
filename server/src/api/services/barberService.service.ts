import { createId } from "@paralleldrive/cuid2";
import { prisma } from "../../db/prisma";
import { CreateService, UpdateService } from "../schemas/barberService.schema";

export async function retrieveServices(shopId: string) {
    const services = await prisma.service.findMany({
        where: { shopId }
    })

    return services;
}

export async function createService(input: CreateService, shopId: string) {
     const id = createId()

    return prisma.service.create({
        data: {
            id,
            shopId,
            name: input.name,
            durationMinutes: input.durationMinutes,
            active: input.active,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })
}

export async function updateService (id: string, input: UpdateService) {
    const service = await prisma.service.findUnique({
        where: { id }
    })

    if (!service) throw new Error ("Service could not be found");

    return prisma.service.update({
        where : { id },
        data: {
            ...input,
            updatedAt: new Date()
        }
    })
}

export async function deleteService(id: string) {
    const service = await prisma.service.findUnique({
        where: { id }
    })

    if (!service) throw new Error ("Service could not be found");

    const existingBookings = await prisma.booking.findFirst({
        where: { 
            serviceId: id,
            status: 'BOOKED'
        }
    })

    if (existingBookings) {
        throw new Error("Cannot delete service with existing bookings, you need to cancel all of the bookings that use this service first.")
    }

    await prisma.booking.deleteMany({
        where: { serviceId: id, status: 'CANCELLED'}
    })

    await prisma.service.delete({
        where: { id }
    })
}