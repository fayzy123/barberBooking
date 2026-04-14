import { z } from 'zod';

// Validating the admin credentials
export const loginSchema = z.object({
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string()
               .min(8, {message: 'Password must be minimum 8 characters' })

});

export type LoginInput = z.infer<typeof loginSchema>