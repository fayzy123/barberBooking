import { Request, Response } from 'express'
import { ZodTypeAny } from 'zod/v4'

export function validateRequest<T>(
  schema: ZodTypeAny,
  data: unknown,
  res: Response
): T | null {
    const result = schema.safeParse(data)
    if (!result.success) {
        res.status(400).json({
            message: 'Validation failed',
            errors: result.error.flatten().fieldErrors
        })
        return null
    }
    return result.data as T
}