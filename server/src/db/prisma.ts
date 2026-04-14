import dotenv from 'dotenv'
import path from 'path'

// Load .env from root (go up 3 levels: src -> server -> root)
dotenv.config({ path: path.join(__dirname, '../../../.env') })

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });