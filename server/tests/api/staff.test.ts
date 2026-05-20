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
    it('should return 401 if no token is provided', async () => {
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
            .send({ name: 'Bo'})
        
        expect(res.status).toBe(400)
    })

    it('should return 400 if body is invalid', async () => {
    const res = await request(app)
        .post('/api/admin/staff')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'Bo' })
    
        expect(res.status).toBe(400)
    })

    it('should return 200 and an array if valid token provided', async () => {
        const res = await request(app)
                    .post('/api/admin/staff')
                    .set('Authorization', `Bearer ${validToken}`)
                    .send({ name: "Test Staff"})

        expect(res.status).toBe(201)
        expect(res.body.name).toBe('Test Staff')
    })
})

describe('PATCH /api/staff/admin/staff/:id', () => {
    it('should return 400 if no token is provided', async () => {
        const res = await request(app)
            .patch('/api/admin/staff/staff_001')
            .send({ name: 'Bo'})
        
        expect(res.status).toBe(400)
    })

    it('should return 400 if body is invalid', async () => {
    const res = await request(app)
        .patch('/api/admin/staff/staff_001')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'Bo' })
    
        expect(res.status).toBe(400)
    })

    it('should return 200 and an array if valid token provided', async () => {
        const res = await request(app)
                    .patch('/api/admin/staff/staff_001')
                    .set('Authorization', `Bearer ${validToken}`)
                    .send({ name: "Fayzy Khan"})

        expect(res.status).toBe(200)
        expect(res.body.name).toBe('Fayzy Khan')
    })
})

describe('PATCH /api/staff/admin/staff/:id/availability', () => {
    it('should return 400 if no token is provided', async () => {
        const res = await request(app)
            .patch('/api/admin/staff/staff_001/availability')
            .send({ name: 'Bo'})
        
        expect(res.status).toBe(400)
    })

    it('should return 400 if body is invalid', async () => {
    const res = await request(app)
        .patch('/api/admin/staff/staff_001/availability')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ availability: [
                { day: 'mon', start: '09:00', end: '17:00' },
                { day: 'tue', start: '09:00' }
            ]
         })
        expect(res.status).toBe(400)
    })

    it('should return 200 and an array if valid token provided', async () => {
        const res = await request(app)
                    .patch('/api/admin/staff/staff_001/availability')
                    .set('Authorization', `Bearer ${validToken}`)
                    .send({ availability: [
                            { day: 'mon', start: '09:00', end: '17:00' },
                            { day: 'tue', start: '09:00', end: '18:00' }
                        ]
                    })

        expect(res.status).toBe(200)
        expect(res.body.name).toBe('Fayzy Khan')
    })
})