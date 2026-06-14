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

beforeEach(async () => {
    await prisma.booking.update({
        where: { id: 'booking_001' },
        data: { 
            staffId: 'staff_001',
            serviceId: 'service_001',
            customerFirstName: 'James',
            customerLastName: 'Wilson',
            customerPhone: '07712345678',
            endTime: new Date('2026-06-02T09:15:00.000Z')
        }
    })
    await prisma.booking.update({
        where: { id: 'booking_018' },
        data: { staffId: 'staff_001' }
    })
    await prisma.booking.update({
        where: { id: 'booking_030' },
        data: { staffId: 'staff_001' }
    })
})

describe('POST /api/admin/bookings', () => {
    it('should return 400 if no token is provided', async () => {
        const res = await request(app)
            .post('/api/admin/bookings')
            .send({ name: 'Bo' })
        
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
                startTime: '2026-09-06T10:00:00.000Z' // Sunday, staff_001 doesnt work Sundays
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
                startTime: '2026-06-02T09:00:00.000Z' // booking_001 already here
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
                staffId: 'staff_001',
                startTime: '2026-06-30T11:00:00.000Z' // staff_001 free here
            })

        expect(res.status).toBe(201)
    })
})

describe('PATCH /api/admin/bookings/:id/reassign', () => {
    beforeEach(async () => {
        await prisma.booking.update({
            where: { id: 'booking_001' },
            data: { staffId: 'staff_001' }
        })
        await prisma.booking.update({
            where: { id: 'booking_030' },
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
        // booking_001 staff_001 at 09:00 June 2
        // booking_003 staff_002 at 09:00 June 2 — conflict
        const res = await request(app)
            .patch('/api/admin/bookings/booking_001/reassign')
            .set('Authorization', `Bearer ${validToken}`)
            .send({ staffId: 'staff_002' })
        
        expect(res.status).toBe(409)
        expect(res.body.error).toBe('SLOT_TAKEN')
    })

    it('should return 409 if new staff has no shift on that day', async () => {
        // booking_016 is Saturday June 7 — staff_001 doesnt work Saturdays
        const res = await request(app)
            .patch('/api/admin/bookings/booking_016/reassign')
            .set('Authorization', `Bearer ${validToken}`)
            .send({ staffId: 'staff_001' })
        
        expect(res.status).toBe(409)
        expect(res.body.error).toBe('NO_SHIFT')
    })

    it('should return 200 if reassignment is valid', async () => {
        // booking_030 staff_001 at 09:00 June 30 — staff_002 is free here
        const res = await request(app)
            .patch('/api/admin/bookings/booking_030/reassign')
            .set('Authorization', `Bearer ${validToken}`)
            .send({ staffId: 'staff_002' })
        
        expect(res.status).toBe(200)
    })
})

describe('PATCH /api/admin/bookings/:id', () => {
    beforeEach(async () => {
        await prisma.booking.update({
            where: { id: 'booking_001' },
            data: { 
                staffId: 'staff_001',
                serviceId: 'service_001',
                customerFirstName: 'James',
                customerLastName: 'Wilson',
                customerPhone: '07712345678',
                endTime: new Date('2026-06-02T09:15:00.000Z')
            }
        })
    })

    it('should return 400 if no token is provided', async () => {
        const res = await request(app)
            .patch('/api/admin/bookings/booking_001')
            .send({ customerFirstName: 'John' })
        
        expect(res.status).toBe(400)
    })

    it('should return 200 and update customer details', async () => {
        const res = await request(app)
            .patch('/api/admin/bookings/booking_001')
            .set('Authorization', `Bearer ${validToken}`)
            .send({ customerFirstName: 'John', customerLastName: 'Doe' })
        
        expect(res.status).toBe(200)
        expect(res.body.customerFirstName).toBe('John')
        expect(res.body.customerLastName).toBe('Doe')
    })

    it('should return 200 and update service with no overlap', async () => {
        // booking_001 at 09:00, booking_002 at 09:30
        // changing to service_002 (30 mins) -> ends at 09:30 exactly, no overlap
        const res = await request(app)
            .patch('/api/admin/bookings/booking_001')
            .set('Authorization', `Bearer ${validToken}`)
            .send({ serviceId: 'service_002' })
        
        expect(res.status).toBe(200)
        expect(res.body.serviceId).toBe('service_002')
    })

    it('should return 409 if service change causes overlap', async () => {
        // booking_001 at 09:00, booking_002 at 09:30
        // changing to service_003 (45 mins) -> ends at 09:45, overlaps booking_002
        const res = await request(app)
            .patch('/api/admin/bookings/booking_001')
            .set('Authorization', `Bearer ${validToken}`)
            .send({ serviceId: 'service_003' })
        
        expect(res.status).toBe(409)
        expect(res.body.error).toBe('SLOT_TAKEN')
    })
})