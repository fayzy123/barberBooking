import { createId } from "@paralleldrive/cuid2";
import { CreateStaff, UpdateShifts, UpdateStaff } from "../../api/schemas/staff.schema";
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
        include: { shifts: true }
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

export async function updateShifts(id: string, input: UpdateShifts) {
    const staff = await getStaffById(id);

    if (!staff) {
        throw new Error("No staff member found")
    }

    await prisma.shift.deleteMany({
        where: { staffId: id}
    })

    await prisma.shift.createMany({
        data: input.shifts.map(s => ({ ...s, id: createId(), staffId: id, updatedAt: new Date() }))
    })

    return prisma.staff.findUnique({
        where: { id },
        include: { shifts: true }
    })
}

