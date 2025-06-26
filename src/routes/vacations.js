import Router from 'find-my-way';

import { authenticate, requireManager } from '../middleware/auth.js';
import { listRequests, createRequest, deleteRequest, approveRequest, rejectRequest } from '../controllers/vacationController.js';

const router = Router();

const methods = ['GET', 'POST', 'PUT', 'DELETE'];

methods.forEach(method => {
    router.on(method, '/api/vacations/*', (req, res, next) => {
        authenticate(req, res, next);
    });
});

router.on('GET', '/api/vacations/', listRequests);
router.on('POST', '/api/vacations/', createRequest);
router.on('DELETE', '/api/vacations/:id', deleteRequest);

router.on('POST', '/api/vacations/:id/approve', (req, res) => {
    authenticate(req, res, () => {
        requireManager(req, res, () => {
            approveRequest(req, res);
        });
    });
});

router.on('POST', '/api/vacations/:id/reject', (req, res) => {
    authenticate(req, res, () => {
        requireManager(req, res, () => {
            rejectRequest(req, res);
        });
    });
});

export default router;