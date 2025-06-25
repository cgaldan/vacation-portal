require('dotenv').config();
const http = require('http');
const Router = require('find-my-way');

const PORT = process.env.PORT || 3000;
const router = Router();

router.on('GET', '/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Vacation Portal API is running');
});

const server = http.createServer((req, res) => {
    router.lookup(req, res);
})

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Server error', err);
});