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