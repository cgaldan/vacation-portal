import bcrypt from 'bcrypt';
import userRepo from '../repositories/userRepository.js';
import { validateEmployeeCode, validatePassword } from '../utils/validators.js';

const SALT_ROUNDS = 10;

async function listUsers(req, res, next) {
    const users = await userRepo.listAll();
    res.end(JSON.stringify(users));
}

async function createUser(req, res, next) {
    const { username, email, password, role, employee_code } = req.body;
    if (!validateEmployeeCode(employee_code)) {
        console.log('Invalid employee code');
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'employee_code must be exactly 7 digits' })); 
        return;
    }
    if (!username || !email || !password || !role || !employee_code) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Missing required fields' })); 
        return;
    }
    if (!validatePassword(password)) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: [
            'Invalid password:',
            ' - must be at least 8 characters long',
            ' - must contain at least one uppercase letter',
            ' - must contain at least one lowercase letter',
            ' - must contain at least one number',
            ' - must contain at least one special character'
        ]}))
        return;
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userRepo.create({ username, email, password_hash: passwordHash, role, employee_code });
    res.statusCode = 201;
    res.end(JSON.stringify(user));
}

async function updateUser(req, res, next) {
    const changes = {...req.body};
    if (changes.password) {
        if (!validatePassword(changes.password)) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: [
                'Invalid password:',
                ' - must be at least 8 characters long',
                ' - must contain at least one uppercase letter',
                ' - must contain at least one lowercase letter',
                ' - must contain at least one number',
                ' - must contain at least one special character'
            ]}))
            return;
        }
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