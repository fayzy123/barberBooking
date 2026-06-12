import { z } from 'zod';

export const createStaffSchema = z.object({
    firstName: z.string().min(3, "First name requires a minimum character length of 3"),
    lastName: z.string().min(3, "Last name requires a minimum character length of 3"),
    active: z.boolean().default(true)
})

export type CreateStaffInput = z.infer<typeof createStaffSchema>