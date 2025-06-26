const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userRepo = require('../repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET;

async function loginHandler(req, res, next) {
    const { email, password_hash } = req.body;
    if (!email || !password_hash) {
        req.statusCode = 400;
        res.end(JSON.stringify({ error: 'Missing credentials' }));
        return;    
    }

    const user = await userRepo.findByEmail(email);
    if (!user) {
        req.statusCode = 401;
        res.end(JSON.stringify({ error: 'Invalid credentials' }));    
        return;
    }

    const valid = await bcrypt.compare(password_hash, user.password_hash);
    if (!valid) {
        req.statusCode = 401;
        res.end(JSON.stringify({ error: 'Invalid credentials' }));    
        return;
    }

    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.end(JSON.stringify({ token }));
}

function authenticate(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.replace('Bearer ', '');
    if (!token) {
        req.statusCode = 401;
        res.end(JSON.stringify({ error: 'Missing token' }));  
        return;  
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = { id: payload.sub, role: payload.role };
        next();
    } catch (err) {
        req.statusCode = 401;
        res.end(JSON.stringify({ error: 'Unauthorized' })); 
        return;   
    }
}

function requireManager(req, res, next) {
    if (req.user.role !== 'manager') {
        req.statusCode = 403;
        res.end(JSON.stringify({ error: 'Manager role required' }));    
    }
    next();
}

module.exports = {
    loginHandler,
    authenticate,
    requireManager
};