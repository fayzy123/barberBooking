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
        throw new Error("No staff member found")
    }

    return staff;
}

export async function createStaff(input: CreateStaff, shopId: string) {
    const id = createId();
    return prisma.staff.create({
        data: {
            id,
            shopId,
            firstName: input.firstName,
            lastName: input.lastName,
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
            firstName: input.firstName,
            lastName: input.lastName,
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

    const shop = await prisma.shop.findFirst({ where: { id: staff.shopId }})
    if (!shop) throw new Error("No shop found")
    
    const invalidShift = input.shifts.find(s => s.active && s.endTime > shop.closeTime)
    if (invalidShift) throw new Error("SHIFT_EXCEEDS_CLOSE")

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

export async function deleteStaff(id: string) {
    const staff = await getStaffById(id);

    if (!staff) {
        throw new Error("No staff member found")
    }

     const existingBookings = await prisma.booking.findFirst({
        where: { 
            staffId: id,
            status: 'BOOKED'
        }
    })

    if (existingBookings) {
        throw new Error("Cannot delete staff member with existing bookings, you need to cancel all of this staff members bookings first.")
    }

    await prisma.booking.deleteMany({
        where: { staffId: id, status: 'CANCELLED'}
    })

    await prisma.staff.delete({
        where: { id }
    })
}

