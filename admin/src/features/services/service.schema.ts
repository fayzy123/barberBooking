import { z } from "zod";

export const createServiceSchema = z.object({
    name: z.string().min(3, "Service name must be longer than 3 characters"),
    durationMinutes: z.number().min(15, "Please enter a value greater than 15 minutes"),
    active: z.boolean().default(true)
})

export const updateServiceSchema = createServiceSchema.partial()

export type CreateService = z.infer<typeof createServiceSchema>
export type UpdateService = z.infer<typeof updateServiceSchema>