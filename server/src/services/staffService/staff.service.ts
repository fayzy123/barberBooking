import { createId } from "@paralleldrive/cuid2";
import { CreateStaff, UpdateStaff, UpdateStaffAvailability } from "../../api/schemas/staff.schema";
import { prisma } from "../../db/prisma";

export async function retrieveStaff(shopId: string) {
    const staff = await prisma.staff.findMany({
        where: { shopId },
    })

    return staff
}

export async function getStaffById(id: string) {
    const staff = await prisma.staff.findUnique({
        where: { id },
    })

    if (!staff) {
        throw new Error("Staff not found!")
    }

    return staff;
}

export async function createStaff(input: CreateStaff, shopId: string) {
    const id = createId();
    return prisma.staff.create({
        data: {
            id,
            shopId,
            name: input.name,
            active: input.active,
            updatedAt: new Date()
        }
    })
}

export async function updateStaff(id: string, input: UpdateStaff) {
    const staff = await getStaffById(id);

    if (!staff) {
        throw new Error("No staff member found")
    }

    return prisma.staff.update({
        where: { id },
        data: {
            name: input.name,
            active: input.active,
            updatedAt: new Date()
        }
    })
}

export async function updateAvailability(id: string, availability: UpdateStaffAvailability["availability"]) {
    const staff = await getStaffById(id);

    if (!staff) {
        throw new Error("No staff member found")
    }

    return prisma.staff.update({
        where: { id },
        data: {
            availability: availability as object[],
            updatedAt: new Date()
        }
    })
}