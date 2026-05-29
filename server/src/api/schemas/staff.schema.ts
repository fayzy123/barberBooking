import { z } from 'zod';

export const createStaffSchema = z.object({
    name: z.string().min(3),
    active: z.boolean().default(true)
})

export const updateStaffSchema = createStaffSchema.partial ()

export const shiftsSchema = z.object ({
    day: z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]),
    startTime: z.string().min(1, "Please select a time"),
    endTime: z.string().min(1, "Please select an end time"),
    breakStart: z.string().min(1, "Please select a break time").nullable().optional(),
    active: z.boolean().default(true)
})

export const updateShiftsSchema = z.object({
    shifts: z.array(shiftsSchema)
})

export type CreateStaff = z.infer<typeof createStaffSchema>
export type UpdateStaff = z.infer<typeof updateStaffSchema>
export type UpdateShifts = z.infer<typeof updateShiftsSchema>