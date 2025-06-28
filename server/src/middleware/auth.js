import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userRepo from '../repositories/userRepository.js';

const JWT_SECRET = process.env.JWT_SECRET;

async function loginHandler(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    const { identifier, password } = req.body;
    if (!identifier || !password) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Missing credentials' }));
        return;    
    }

    const user = await userRepo.findByIdentifier(identifier);
    if (!user) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: 'Invalid credentials' }));    
        return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: 'Invalid credentials' }));    
        return;
    }

    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.end(JSON.stringify({ token }));
}

function authenticate(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.replace('Bearer ', '');
    res.setHeader('Content-Type', 'application/json');
    
    if (!token) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: 'Missing token' }));  
        return;  
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = { id: payload.sub, role: payload.role };
        next();
    } catch (err) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: 'Unauthorized' })); 
        return;   
    }
}

function requireManager(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    if (req.user.role !== 'manager') {
        res.statusCode = 403;
        res.end(JSON.stringify({ error: 'Manager role required' }));    
        return;
    }
    next();
}

export {
    loginHandler,
    authenticate,
    requireManager
}