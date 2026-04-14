import { LoginInput } from "../../api/schemas/auth.schema"
import { prisma } from "../../db/prisma"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!

export async function loginAdmin(input: LoginInput) {
    // 1. Find the admin by email in DB
    const admin = await prisma.admin.findUnique({
        where: { email : input.email },
    })

    // 2. If no admin found, reject - keep message vague for security
    if (!admin) {
        throw new Error("Invalid email or password!")
    }

    // 3. compare plain text password against the stored hash
    const passwordValid = await bcrypt.compare(input.password, admin.passwordHash)

    // 4. If password doesnt match, reject it
    if (!passwordValid) {
        throw new Error("Password is incorrect")
    }

    // 5. Sign a JWT with admins ID, email, and role as payload
    const token = jwt.sign(
        {
            sub: admin.id,
            email: admin.email,
            role: admin.role,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8 // 8 hours 
        },
        JWT_SECRET
    )

    // 6. Return the token and safe admin info (never return password hash)
    return {
        token,
        admin: {
            id: admin.id,
            email: admin.email,
            role: admin.role
        },
    } 
}