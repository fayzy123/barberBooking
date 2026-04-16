import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!

export interface AuthRequest extends Request {
    admin?: {
        id: string,
        email: string,
        role: string,
        shopId: string
    }
}

export function authenticate(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    // 1. Grab the Authorization header from the request
    const authHeader = req.headers.authorization

    // 2. Check if header exists and starts with Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(400).json({ message: 'No token provided' })
        return
    }

    // 3. Extract just the token part after the 'Bearer '
    const token = authHeader.split(' ')[1]

    // 4. Verify token is valid and not expired
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            sub: string,
            email: string,
            role: string,
            shopId: string
        }

        // 5. Attach decoded admin info to request object
        req.admin = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
            shopId: decoded.shopId
        }
        next()
    } catch {
        res.status(401).json({ message: 'Invalid or expired token'})
    }
}