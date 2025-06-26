import Router from 'find-my-way';

import { loginHandler, authenticate, requireManager } from '../middleware/auth.js';
import { listUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = Router();

router.on('POST', '/api/users/login', loginHandler);

router.on('GET', '/api/users/', (req, res) => {
    authenticate(req, res, () => {
        requireManager(req, res,  () => {
            listUsers(req, res);
        });
    })
});


// router.on('POST',   '/api/users',     authenticate, requireManager, createUser);
// router.on('PUT',    '/api/users/:id', authenticate, requireManager, updateUser);
// router.on('DELETE', '/api/users/:id', authenticate, requireManager, deleteUser);

export default router;