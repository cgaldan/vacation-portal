const Router = require('find-my-way');

const {
    loginHandler,
    authenticate,
    requireManager
} = require('../middleware/auth');

const {
    listUsers,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const router = Router();
const methods = ['GET', 'POST', 'PUT', 'DELETE'];

router.on('POST',   '/api/users/login',     loginHandler);

methods.forEach(method => {
    router.on(method, '/api/users/*', authenticate);
});

router.on('GET',    '/api/users',     requireManager, listUsers);
router.on('POST',   '/api/users',     requireManager, createUser);
router.on('PUT',    '/api/users/:id', requireManager, updateUser);
router.on('DELETE', '/api/users/:id', requireManager, deleteUser);

module.exports = router;