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

describe('GET /api/staff/admin/staff', () => {
    it('should return 400 if no token is provided', async () => {
        const res = await request(app)
            .get('/api/admin/staff')
        
        expect(res.status).toBe(400)
    })

    it('should return 200 and an array if valid token provided', async () => {
        const res = await request(app)
                    .get('/api/admin/staff')
                    .set('Authorization', `Bearer ${validToken}`)

        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })
})

describe('POST /api/staff/admin/staff', () => {
    it('should return 400 if no token is provided', async () => {
        const res = await request(app)
            .post('/api/admin/staff')
            .send({ firstName: 'Bo', lastName: "Da"})
        
        expect(res.status).toBe(400)
    })

    it('should return 400 if body is invalid', async () => {
    const res = await request(app)
        .post('/api/admin/staff')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ firstName: 'Bo', lastName: "Da"})
    
        expect(res.status).toBe(400)
    })

    it('should return 200 and an array if valid token provided', async () => {
        const res = await request(app)
                    .post('/api/admin/staff')
                    .set('Authorization', `Bearer ${validToken}`)
                    .send({ firstName: 'Test', lastName: "Staff"})

        expect(res.status).toBe(201)
        expect(res.body.firstName).toBe('Test')
    })
})

describe('PATCH /api/staff/admin/staff/:id', () => {
    it('should return 400 if no token is provided', async () => {
        const res = await request(app)
            .patch('/api/admin/staff/staff_001')
            .send({ firstName: 'Bo', lastName: "Da"})
        
        expect(res.status).toBe(400)
    })

    it('should return 400 if body is invalid', async () => {
    const res = await request(app)
        .patch('/api/admin/staff/staff_001')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ firstName: 'Bo', lastName: "Da"})
    
        expect(res.status).toBe(400)
    })

    it('should return 200 and an array if valid token provided', async () => {
        const res = await request(app)
                    .patch('/api/admin/staff/staff_001')
                    .set('Authorization', `Bearer ${validToken}`)
                    .send({ firstName: 'Fayzy', lastName: "Khan"})

        expect(res.status).toBe(200)
        expect(res.body.firstName).toBe('Fayzy')
    })
})

describe('PATCH /api/staff/admin/staff/:id/shifts', () => {
    it('should return 400 if no token is provided', async () => {
        const res = await request(app)
            .patch('/api/admin/staff/staff_001/shifts')
            .send({ firstName: 'Bo'})
        
        expect(res.status).toBe(400)
    })

    it('should return 400 if body is invalid', async () => {
    const res = await request(app)
        .patch('/api/admin/staff/staff_001/shifts')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'Bo' })
    
        expect(res.status).toBe(400)
    })

    it('should return 200 and an array if valid token provided', async () => {
        const res = await request(app)
                    .patch('/api/admin/staff/staff_001/shifts')
                    .set('Authorization', `Bearer ${validToken}`)
                    .send({
                        shifts: [
                            { day: 'mon', startTime: '09:00', endTime: '17:00', breakStart: '12:00', active: true },
                            { day: 'tue', startTime: '09:00', endTime: '17:00', breakStart: '12:00', active: true },
                            { day: 'wed', startTime: '09:00', endTime: '17:00', breakStart: '12:00', active: true },
                            { day: 'thu', startTime: '09:00', endTime: '17:00', breakStart: '12:00', active: true },
                            { day: 'fri', startTime: '09:00', endTime: '17:00', breakStart: '12:00', active: true },
                            { day: 'sat', startTime: '09:00', endTime: '17:00', active: false },
                            { day: 'sun', startTime: '09:00', endTime: '17:00', active: false },
                        ]
                    })

        expect(res.status).toBe(200)
        expect(res.body.shifts).toBeDefined()
    })
})

describe('DELETE /api/admin/staff/:id', () => {
    it('should return 400 if no token is provided', async () => {
        const res = await request(app)
            .delete('/api/admin/staff/staff_001')
        
        expect(res.status).toBe(400)
    })

    it('should return 404 if staff member not found', async () => {
        const res = await request(app)
            .delete('/api/admin/staff/invalid_id')
            .set('Authorization', `Bearer ${validToken}`)
        
        expect(res.status).toBe(404)
    })

    it('should return 500 if staff member has active bookings', async () => {
        const res = await request(app)
            .delete('/api/admin/staff/staff_001')
            .set('Authorization', `Bearer ${validToken}`)
        
        expect(res.status).toBe(500)
    })

    it('should return 200 and delete staff member successfully', async () => {
        // First create a staff member to delete
        const created = await request(app)
            .post('/api/admin/staff')
            .set('Authorization', `Bearer ${validToken}`)
            .send({ firstName: 'Test', lastName: 'Delete' })

        const res = await request(app)
            .delete(`/api/admin/staff/${created.body.id}`)
            .set('Authorization', `Bearer ${validToken}`)
        
        expect(res.status).toBe(200)
    })
})