import { beforeEach, describe, expect, it } from "vitest"
import request from 'supertest';
import app from "../../src/app";
import jwt from 'jsonwebtoken';
import { prisma } from "../../src/db/prisma";

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
        beforeEach(async () => {
        await prisma.booking.update({
            where: { id: 'booking_001' },
            data: { staffId: 'staff_001' }
        })
        await prisma.booking.update({
            where: { id: 'booking_025' },
            data: { staffId: 'staff_001' }
        })
    })
    
    it('should return 400 if no token is provided', async () => {
        const res = await request(app)
            .post('/api/admin/bookings')
            .send({ name: 'Bo'})
        
        expect(res.status).toBe(400)
    })

    it('should return 409 when booking outside shift availability', async () => {
        const res = await request(app)
            .post('/api/admin/bookings')
            .set('Authorization', `Bearer ${validToken}`)
            .send({ 
                customerFirstName: 'Test',
                customerLastName: 'Customer',
                customerPhone: '07712345678',
                serviceId: 'service_001',
                staffId: 'staff_001',
                startTime: '2026-09-06T10:00:00.000Z'
            })
        
        expect(res.status).toBe(409)
        expect(res.body.error).toBe('NO_SHIFT')
    })

    it('should return 409 if staff member is already booked', async () => {
    const res = await request(app)
        .post('/api/admin/bookings')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ 
            customerFirstName: 'Test',
            customerLastName: 'Customer',
            customerPhone: '07712345678',
            serviceId: 'service_001',
            staffId: 'staff_001',
            startTime: '2026-06-01T09:00:00.000Z'
        })
        expect(res.status).toBe(409)
        expect(res.body.error).toBe('SLOT_TAKEN')
    }) 

    it('should return 201 when booking is valid', async () => {
        const res = await request(app) 
        
            .post('/api/admin/bookings')
            .set('Authorization', `Bearer ${validToken}`)
            .send({ 
                customerFirstName: 'Test',
                customerLastName: 'Customer',
                customerPhone: '07712345678',
                serviceId: 'service_001',
                staffId: 'staff_002',
                startTime: '2026-06-02T11:00:00.000Z'
            })
            console.log('valid booking error:', res.body)
        expect(res.status).toBe(201)
    })
})

describe('PATCH /api/admin/bookings/:id/reassign', () => {
    beforeEach(async () => {
        await prisma.booking.update({
            where: { id: 'booking_025' },
            data: { staffId: 'staff_001' }
        })
        await prisma.booking.update({
            where: { id: 'booking_009' },
            data: { staffId: 'staff_001' }
        })
    })
    
    
    it('should return 400 if no token is provided', async () => {
        const res = await request(app)
            .patch('/api/admin/bookings/booking_001/reassign')
            .send({ staffId: 'staff_002' })
        
        expect(res.status).toBe(400)
    })

    it('should return 409 if new staff already has a booking at that time', async () => {
        const res = await request(app)
            .patch('/api/admin/bookings/booking_009/reassign')
            .set('Authorization', `Bearer ${validToken}`)
            .send({ staffId: 'staff_002' })
        
        expect(res.status).toBe(409)
        expect(res.body.error).toBe('SLOT_TAKEN')
    })

    it('should return 200 if reassignment is valid', async () => {
        const res = await request(app)
            .patch('/api/admin/bookings/booking_025/reassign')
            .set('Authorization', `Bearer ${validToken}`)
            .send({ staffId: 'staff_002' })
        console.log('reassign error:', res.body)
        expect(res.status).toBe(200)
    })
})