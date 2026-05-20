import { loginAdmin } from "../services/auth.service";
import { loginSchema } from "../schemas/auth.schema";
import { Request, Response } from "express";

export async function login(req: Request, res: Response) {
    // 1. Grab email/password from request body
    const body = req.body;

    // 2. check if body matches what we expect
    const validation = loginSchema.safeParse(body);

    // 3. If validation fails, tell client what went wrong
    if (validation.success === false) {
        const errors = validation.error.flatten().fieldErrors;
        res.status(400).json({
            message: 'Validation failed',
            errors: errors
        })
        return
    }

    // 4. If validation passes, grab clean validated data
    const validatedData = validation.data;

    // 5. Try to login using the auth service
    try {
        const result = await loginAdmin(validatedData);
        // 6. login successful, send back token and admin info
        res.status(200).json(result);
    } catch (error : unknown) {
        const message = error instanceof Error ? error.message : 'Unauthorised'
        res.status(401).json({message })
    }
}