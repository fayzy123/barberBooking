import { describe, expect, it } from "vitest"
import request from 'supertest';
import app from "../../src/app";
import jwt from 'jsonwebtoken';

const TEST_SECRET = process.env.JWT_SECRET || 'test-secret'

const validToken = jwt.sign(
    {
        sub: "admin_001",
        email: "admin@fayzhan.co.uk",
        role: "ADMIN",
        shopId: "shop_001"
    },
    TEST_SECRET,
    { expiresIn: '1d' }
)

describe('POST /api/admin/bookings', () => {
    it('should return 400 if no token is provided', async () => {
        const res = await request(app)
            .post('/api/admin/bookings')
            .send({ name: 'Bo'})
        
        expect(res.status).toBe(400)
    })

    it('should return 500 if booking outside staff availibility', async () => {
    const res = await request(app)
        .post('/api/admin/bookings')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ 
            customerName: 'Test Customer',
            customerPhone: '07712345678',
            serviceId: 'service_001',
            staffId: 'staff_001',
            startTime: '2026-06-01T10:00:00.000Z' // sunday and Fayzy dont work sundays
         })
    
        expect(res.status).toBe(500)
    })

    it('should return 500 if staff member is already booked', async () => {
    const res = await request(app)
        .post('/api/admin/bookings')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ 
            customerName: 'Test Customer',
            customerPhone: '07712345678',
            serviceId: 'service_001',
            staffId: 'staff_001',
            startTime: '2026-05-19T09:00:00.000Z' // Fayzy already has a booking at 9am at this time 
         })
    
        expect(res.status).toBe(500)
    })
})