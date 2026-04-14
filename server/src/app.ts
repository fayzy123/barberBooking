import dotenv from 'dotenv'
import path from 'path'

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import express from 'express'
import cors from 'cors'
import { prisma } from './db/prisma'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' })
})

// Database test
app.get('/api/test/db', async (req, res) => {
  try {
    const shops = await prisma.shop.findMany()
    const staff = await prisma.staff.findMany()
    const services = await prisma.service.findMany()
    const bookings = await prisma.booking.findMany()
    
    res.json({
      status: 'Database connected',
      data: {
        shops: shops.length,
        staff: staff.length,
        services: services.length,
        bookings: bookings.length,
        shopDetails: shops
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'Database error',
      error: String(error)
    })
  }
})

export default app