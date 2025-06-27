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

describe('Vacation Requests API', () => {
    it('manager can list all requests', async () => {
        const response = await request(server).get('/api/vacations/').set('Authorization', `Bearer ${managerToken}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(3);
        expect(response.body.every(request => request.hasOwnProperty('status'))).toBe(true);
    });

    it('employee can list only his own requests', async () => {
        const response = await request(server).get('/api/vacations/').set('Authorization', `Bearer ${employeeToken}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(2);
        expect(response.body.every(request => request.hasOwnProperty('status'))).toBe(true);
        expect(response.body.every(request => request.user_id === 2)).toBe(true);
    })

    it('employee can create a new request', async () => {
        const payload = {
            start_date: '2025-10-06',
            end_date: '2025-17-06',
            reason: 'Test creation'
        };

        const response = await request(server).post('/api/vacations/').set('Authorization', `Bearer ${employeeToken}`).send(payload);
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({ ...payload, user_id: 2, status: 'pending' });
    });

    it('should reject a vacation request where start_date is after end_date', async () => {
        const payload = {
            start_date: '2025-10-10',
            end_date: '2025-10-05',
            reason: 'Test invalid date range'
        };

        const response = await request(server).post('/api/vacations/').set('Authorization', `Bearer ${employeeToken}`).send(payload);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toMatch(/Start date must be before end date/i);
    });


    it('employee can delete their own pending request', async () => {
        const payload = {
            start_date: '2025-10-06',
            end_date: '2025-17-06',
            reason: 'Test deletion'
        };

        const create = await request(server).post('/api/vacations/').set('Authorization', `Bearer ${employeeToken}`).send(payload);
        const id = create.body.id;

        const del = await request(server).delete(`/api/vacations/${id}`).set('Authorization', `Bearer ${employeeToken}`);
        expect(del.statusCode).toBe(204);
    });

    it('employee cannot delete non-pending or other employee request', async () => {
        const [approvedDelete, otherDelete] = await Promise.all([
            request(server).delete('/api/vacations/2').set('Authorization', `Bearer ${employeeToken}`),
            request(server).delete('/api/vacations/3').set('Authorization', `Bearer ${employeeToken}`)
        ])

        expect(approvedDelete.statusCode).toBe(400);
        expect(otherDelete.statusCode).toBe(403);
    })

    it('manager can approve a pending request', async () => {
        const response = await request(server).post('/api/vacations/1/approve').set('Authorization', `Bearer ${managerToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('approved');
    });

    it('manager can reject a pending request', async () => {
        const { body } = await request(server).post('/api/vacations/').set('Authorization', `Bearer ${employeeToken}`).send({
            start_date: '2025-10-06',
            end_date: '2025-17-06',
            reason: 'Test rejection'
        });

        const id = body.id;
        console.log(body);
        const response = await request(server).post(`/api/vacations/${id}/reject`).set('Authorization', `Bearer ${managerToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('rejected');
    });

    it('rejects unauthorized actions', async () => {
        const response1 = await request(server).get('/api/vacations/');
        expect(response1.statusCode).toBe(401);

        const response2 = await request(server).post('/api/vacations/1/approve').set('Authorization', `Bearer ${employeeToken}`);
        expect(response2.statusCode).toBe(403);
    });    
})