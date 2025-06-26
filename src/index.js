import 'dotenv/config';
import http from 'http';
import Router from 'find-my-way';
import userRoutes from './routes/users.js';
import { error } from 'console';

const PORT = process.env.PORT || 3000;
const router = Router();

const methods = ['GET', 'POST', 'PUT', 'DELETE'];

router.on('GET', '/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Vacation Portal API is running');
});

methods.forEach(method => {
    router.on(method, '/api/users/*', (req, res, next) => {
        userRoutes.lookup(req, res, next);
    });
});

const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });
    req.on('end', () => {
        console.log('Raw request body', body);
        if (body) {
            try {
                req.body = JSON.parse(body);
            } catch (err) {
                req.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        } else {
            req.body = {};
        }
        console.log('→', req.method, req.url);
        router.lookup(req, res);
    });
})

if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    }).on('error', (err) => {
        console.error('Server error', err);
    });
}

export default server;