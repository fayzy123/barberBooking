import { z } from 'zod';

const updateShop = z.object({
    name: z.string().min(3),
    openTime: z.string().min(1, "Please select an open time"),
    closeTime: z.string().min(1, "Please select a close time"),
    bookAheadDays: z.number().min(1, "Please enter a valid number of days"),
    leadTime: z.number().min(1, "Please enter a valid lead time"),
    slotInterval: z.number().min(1, "Please enter a valid value")
})

export const updateShopSchema = updateShop.partial();

export type UpdateShop = z.infer<typeof updateShopSchema>
