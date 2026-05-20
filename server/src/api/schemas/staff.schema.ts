import { z } from 'zod';

export const createStaffSchema = z.object({
    name: z.string().min(3),
    active: z.boolean().default(true)
})

export const updateStaffSchema = createStaffSchema.partial ()

export const updateAvailabilitySchema = z.object ({
    availability: z.array(
        z.object({
            day: z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]),
            start: z.string(),
            end: z.string()
        })
    )
})

export type CreateStaff = z.infer<typeof createStaffSchema>
export type UpdateStaff = z.infer<typeof updateStaffSchema>
export type UpdateStaffAvailability = z.infer<typeof updateAvailabilitySchema>