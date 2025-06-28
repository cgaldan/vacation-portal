import request from 'supertest';
import server from '../../src/index.js';
import db from '../../src/db.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

let managerToken;
let employeeToken;

beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
    await db.seed.run();

    const manager = await request(server).post('/api/users/login').send({ email: '6Tb0F@example.com', password: 'password' });
    managerToken = manager.body.token;

    const employee = await request(server).post('/api/users/login').send({ email: '8tHbO@example.com', password: 'password' });
    employeeToken = employee.body.token;
});

afterAll(async () => {
    await db.destroy();
    server.close();
});

describe('Authentication & User routes', () => {
    it('should reject login with missing fields', async () => {
        const response = await request(server).post('/api/users/login').send({ email: '6Tb0F@example.com' });
        expect(response.statusCode).toBe(400);
    });

    it('should reject login with invalid email', async () => {
        const response = await request(server).post('/api/users/login').send({ email: 'invalid-email', password: 'password' });
        expect(response.statusCode).toBe(401);
    });

    it('should reject login with invalid password', async () => {
        const response = await request(server).post('/api/users/login').send({ email: '6Tb0F@example.com', password: 'wrong-password' });
        expect(response.statusCode).toBe(401);
    });

    it('should allow login with valid credentials', async () => {
        const response = await request(server).post('/api/users/login').send({ email: '6Tb0F@example.com', password: 'password' });
        expect(response.statusCode).toBe(200);
    });

    it('should allow manager to list users', async () => {
        const response = await request(server).get('/api/users/').set('Authorization', `Bearer ${managerToken}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should forbid employee to list users', async () => {
        const response = await request(server).get('/api/users/').set('Authorization', `Bearer ${employeeToken}`);
        expect(response.statusCode).toBe(403);
    });

    it('should reject unauthenticated list users', async () => {
        const response = await request(server).get('/api/users/');
        expect(response.statusCode).toBe(401);
    });
});