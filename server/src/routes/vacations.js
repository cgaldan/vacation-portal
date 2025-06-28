import Router from 'find-my-way';

import { authenticate, requireManager } from '../middleware/auth.js';
import { listRequests, createRequest, deleteRequest, approveRequest, rejectRequest } from '../controllers/vacationController.js';

const router = Router();

router.on('GET', '/api/vacations/', (req, res) => {
    authenticate(req, res, () => {
        listRequests(req, res);
    });
});

router.on('POST', '/api/vacations/', (req, res) => {
    authenticate(req, res, () => {
        createRequest(req, res);
    });
});

router.on('DELETE', '/api/vacations/:id', (req, res, params) => {
    req.params = params;
    authenticate(req, res, () => {
        deleteRequest(req, res);
    });
});

router.on('POST', '/api/vacations/:id/approve', (req, res, params) => {
    req.params = params;
    authenticate(req, res, () => {
        requireManager(req, res, () => {
            approveRequest(req, res);
        });
    });
});

router.on('POST', '/api/vacations/:id/reject', (req, res, params) => {
    req.params = params;
    authenticate(req, res, () => {
        requireManager(req, res, () => {
            rejectRequest(req, res);
        });
    });
});

export default router;