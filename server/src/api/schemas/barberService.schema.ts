import { z } from "zod";

export const createServiceSchema = z.object({
    name: z.string().min(3),
    durationMinutes: z.number().min(1, "Please enter a valid value"),
    active: z.boolean().default(true)
})

export const updateServiceSchema = createServiceSchema.partial();

export type CreateService = z.infer<typeof createServiceSchema>
export type UpdateService = z.infer<typeof updateServiceSchema>