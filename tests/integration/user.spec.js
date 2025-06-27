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

describe ('User CRUD (manager only)', () => {
    let newUserId

    it('should create a new user', async () => {
        const payload = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'test',
            role: 'employee',
            employee_code: '9999999'
        };

        const response = await request(server).post('/api/users/').set('Authorization', `Bearer ${managerToken}`).send(payload);

        expect(response.statusCode).toBe(201);
        expect(response.body.username).toBe(payload.username);
        expect(response.body.email).toBe(payload.email);
        expect(response.body.role).toBe(payload.role);
        expect(response.body.employee_code).toBe(payload.employee_code); 

        newUserId = response.body.id;
    });

    it('updates an existing user', async () => {
        const updated = {
            username: 'updateduser',
            email: 'update@example.com',
            password: 'newPass',
        };

        const response = await request(server).put(`/api/users/${newUserId}`).set('Authorization', `Bearer ${managerToken}`).send(updated);

        expect(response.statusCode).toBe(200);
        expect(response.body.username).toBe(updated.username);
        expect(response.body.email).toBe(updated.email);
    });

    it('should delete a user', async () => {
        const response = await request(server).delete(`/api/users/${newUserId}`).set('Authorization', `Bearer ${managerToken}`);
        expect(response.statusCode).toBe(204);
        
        const list = await request(server).get('/api/users/').set('Authorization', `Bearer ${managerToken}`);
        expect(list.body.find(user => user.id === newUserId)).toBeUndefined();
    });

    it('should reject non-manager requests', async () => {
        const response1 = await request(server).post('/api/users/').send({ username: 'test', email: 'test@test.com', password: 'test', role : 'employee', employee_code: '1234567' });
        expect(response1.statusCode).toBe(401);

        const { body: login } = await request(server).post('/api/users/login').send({ email: '8tHbO@example.com', password: 'password' });

        const response2 = await request(server).delete(`/api/users/${newUserId}`).set('Authorization', `Bearer ${login.token}`);
        expect(response2.statusCode).toBe(403);
    });
})