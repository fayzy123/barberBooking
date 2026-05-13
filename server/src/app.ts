import dotenv from 'dotenv'
import path from 'path'
// Load .env from root
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import express from 'express'
import cors from 'cors'
import authRoutes from './api/routes/auth.routes'
import bookingRoutes from './api/routes/booking.routes'
import staffRoutes from './api/routes/staff.routes'
import { authenticate } from './middleware/authenticate'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' })
})

// Admin Routes
app.use('/api/admin/auth', authRoutes)

// Booking Routes
app.use('/api/admin/bookings', authenticate, bookingRoutes)

// Staff Routes
app.use('/api/admin/staff', authenticate, staffRoutes)

export default app