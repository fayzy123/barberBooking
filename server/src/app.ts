import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { prisma } from './db/prisma'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' })
})


export default app
