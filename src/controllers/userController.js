import bcrypt from 'bcrypt';
import userRepo from '../repositories/userRepository.js';

const SALT_ROUNDS = 10;

async function listUsers(req, res, next) {
    const users = await userRepo.listAll();
    res.end(JSON.stringify(users));
}

async function createUser(req, res, next) {
    const { username, email, password, role, employee_code } = req.body;
    if (!username || !email || !password || !role || !employee_code) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Missing required fields' })); 
        return;
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userRepo.create({ username, email, passwordHash, role, employee_code });
    res.statusCode = 201;
    res.end(JSON.stringify(user));
}

async function updateUser(req, res, next) {
    const changes = {...req.body};
    if (changes.password) {
        changes.password_hash = await bcrypt.hash(changes.password, SALT_ROUNDS);
        delete changes.password;
    }
    const user = await userRepo.update(req.params.id, changes);
    res.statusCode = 200;
    res.end(JSON.stringify(user));
}

async function deleteUser(req, res, next) {
    await userRepo.remove(req.params.id);
    res.statusCode = 204;
    res.end();
}

export {
    listUsers,
    createUser,
    updateUser,
    deleteUser
}