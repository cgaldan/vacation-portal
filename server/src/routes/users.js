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

router.on('POST', '/api/users/', (req, res) => {
    authenticate(req, res, () => {
        requireManager(req, res, () => {
            createUser(req, res);
        });
    });
});

router.on('PUT', '/api/users/:id', (req, res, params) => {
    req.params = params;
    authenticate(req, res, () => {
        requireManager(req, res, () => {
            updateUser(req, res);
        });
    });
});

router.on('DELETE', '/api/users/:id', (req, res, params) => {
    req.params = params;
    authenticate(req, res, () => {
        requireManager(req, res, () => {
            deleteUser(req, res);
        });
    });
});

export default router;