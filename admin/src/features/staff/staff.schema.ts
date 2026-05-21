import { z } from 'zod';

export const createStaffSchema = z.object({
    name: z.string().min(3, "Staff name must be longer than 3 characters"),
    active: z.boolean().default(true)
})

export type CreateStaffInput = z.infer<typeof createStaffSchema>