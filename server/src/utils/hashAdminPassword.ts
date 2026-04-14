import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.join(__dirname, '../../../.env') })

import bcrypt from 'bcryptjs';
import { prisma } from '../db/prisma';

const ADMIN_EMAIL = 'admin@fayzhan.co.uk'
const NEW_PASSWORD = process.env.ADMIN_SEED_PASSWORD

async function main() {
    if (!NEW_PASSWORD) {
        throw new Error('ADMIN_SEED_PASSWORD is not set in your .env file');
    }

    const hash = await bcrypt.hash(NEW_PASSWORD, 12)

    const updated = await prisma.admin.update({
        where: {email: ADMIN_EMAIL },
        data: { passwordHash: hash }
    })

    console.log(`Password hashed and updated for ${updated.email}`)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())