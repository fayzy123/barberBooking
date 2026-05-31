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

describe('GET /api/admin/shop', () => {
    it('should return 400 if no token is provided', async () => {
        const res = await request(app)
            .get('/api/admin/shop')
        
        expect(res.status).toBe(400)
    })

    it('should return 200 and shop details if token is provided', async() => {
        const res = await request(app)
                    .get("/api/admin/shop")
                    .set('Authorization', `Bearer ${validToken}`)

        expect(res.status).toBe(200)
    })
})

describe('PATCH /api/admin/shop', () => {
    it('should return 400 if no token is provided', async () => {
        const res = await request(app)
            .patch('/api/admin/shop')
            .send({leadTime: -1})
        
        expect(res.status).toBe(400)
    })

    it('should return 400 if body is invalid', async () => {
    const res = await request(app)
        .patch('/api/admin/shop')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ leadTime: -1 })
    
        expect(res.status).toBe(400)
    })

    it('should return 200 and an array if valid', async() => {
        const res = await request(app)
                    .patch('/api/admin/shop')
                    .set('Authorization', `Bearer ${validToken}`)
                    .send({ name: "Fayzhan's BarberShop"})

        expect(res.status).toBe(200)
        expect(res.body.name).toBe("Fayzhan's BarberShop")
    })
})