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

describe('POST /api/admin/services', () => {
    it('should return 400 if no token is provided', async () => {
        const res = await request(app)
            .post('/api/admin/services')
            .send({ name: 'Bo'})
        
        expect(res.status).toBe(400)
    })

    it('should return 400 if body is invalid', async () => {
    const res = await request(app)
        .post('/api/admin/services')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'Bo' })
    
        expect(res.status).toBe(400)
    })

    it('should return 201 and an array if valid token provided', async () => {
        const res = await request(app)
                    .post('/api/admin/services')
                    .set('Authorization', `Bearer ${validToken}`)
                    .send({ name: "Test Service", durationMinutes: 15})

        expect(res.status).toBe(201)
        expect(res.body.name).toBe('Test Service')
    })
})


describe('PATCH /api/admin/services:id', () => {
    it('should return 400 if no token is provided', async () => {
        const res = await request(app)
            .patch('/api/admin/services/service_001')
            .send({ durationMinutes: -1 })
        
        expect(res.status).toBe(400)
    })

    it('should return 400 if body is invalid', async () => {
    const res = await request(app)
        .patch('/api/admin/services/service_001')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ durationMinutes: -1 })
    
        expect(res.status).toBe(400)
    })

    it('should return 200 and an array if valid token provided', async () => {
        const res = await request(app)
                    .patch('/api/admin/services/service_004')
                    .set('Authorization', `Bearer ${validToken}`)
                    .send({ name: "Hot Towel + Beard Trim"})

        expect(res.status).toBe(200)
        expect(res.body.name).toBe('Hot Towel + Beard Trim')
    })

})