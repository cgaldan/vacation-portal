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
    if (await userRepo.findByEmail(email)) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Email already in use' })); 
        return;
    }
    if (await userRepo.findByUsername(username)) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Username already in use' })); 
        return;
    }
    if (await userRepo.findByEmployeeCode(employee_code)) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Employee code already in use' })); 
        return;
    }
    if (!validateEmployeeCode(employee_code)) {
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
        res.end(JSON.stringify({ error: "weak password" }));
        return;
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userRepo.create({ username, email, password_hash: passwordHash, role, employee_code });
    res.statusCode = 201;
    res.end(JSON.stringify(user));
}

async function updateUser(req, res, next) {
    const { id } = req.params;
    const changes = {...req.body};
    try {
        const existing = await userRepo.findById(id);
        if (!existing) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'User not found' })); 
            return;
        }

        if (changes.username && changes.username !== existing.username) {
            if (await userRepo.findByUsername(changes.username)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Username already in use' })); 
                return;
            }
        }
        if (changes.email && changes.email !== existing.email) {
            if (await userRepo.findByEmail(changes.email)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Email already in use' })); 
                return;
            }
        }
        if (changes.employee_code === '' || changes.employee_code === undefined) {
            delete changes.employee_code;
        }

        if (changes.password) {
            if (!validatePassword(changes.password)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "weak password" }));
                return;
            }
            changes.password_hash = await bcrypt.hash(changes.password, SALT_ROUNDS);
            delete changes.password;
        }
        const user = await userRepo.update(id, changes);
        res.statusCode = 200;
        res.end(JSON.stringify(user));
    } catch (err) {
        next(err);
    }
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