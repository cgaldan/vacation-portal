const bcrypt = require('bcrypt');
const userRepo = require('../repositories/userRepository');

const SALT_ROUNDS = 10;

async function listUsers(req, res, next) {
    const users = await userRepo.listAll();
    res.json(users);
}

async function createUser(req, res, next) {
    const { username, email, password, role, employee_code } = req.body;
    if (!username || !email || !password || !role || !employee_code) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userRepo.create({ username, email, passwordHash, role, employee_code });
    res.status(201).json(user);
}

async function updateUser(req, res, next) {
    const changes = {...req.body};
    if (changes.password) {
        changes.password_hash = await bcrypt.hash(changes.password, SALT_ROUNDS);
        delete changes.password;
    }
    const user = await userRepo.update(req.params.id, changes);
    res.json(user);
}

async function deleteUser(req, res, next) {
    await userRepo.remove(req.params.id);
    res.status(204).end();
}

module.exports = {
    listUsers,
    createUser,
    updateUser,
    deleteUser
}