import db from "../src/db";
import userRepository from "../src/repositories/userRepository";

beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
    await db.seed.run();
});

afterAll(async () => {
    await db.destroy();
});

describe('User repository', () => {
    it('should find user by id', async () => {
        const user = await userRepository.findById(1);
        expect(user.id).toBe(1);
        expect(user.username).toBe('manager');
        expect(user.email).toBe('6Tb0F@example.com');
        expect(user.role).toBe('manager');
        expect(user.employee_code).toBe('0000001');
    });

    it('should find user by email', async () => {
        const user = await userRepository.findByEmail('6Tb0F@example.com');
        expect(user.id).toBe(1);
        expect(user.username).toBe('manager');
        expect(user.email).toBe('6Tb0F@example.com');
        expect(user.role).toBe('manager');
        expect(user.employee_code).toBe('0000001');
    });

    it('should list all users', async () => {
        const users = await userRepository.listAll();
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);
    });
});