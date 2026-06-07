import { z } from 'zod';

export const editShopSettingSchema = z.object({
    name: z.string().min(3, "Shop name must be longer than 3 characters"),
    openTime: z.string().min(1, "Please select a time"),
    closeTime: z.string().min(1, "Please select a time"),
    slotInterval: z.number().min(1, "Please enter a value greater than 1"),
    leadTime: z.number().min(1, "Please enter a value greater than 1"),
    bookAheadDays: z.number().min(1, "Please enter a value greater than 1")
})

export type EditShop = z.infer<typeof editShopSettingSchema>