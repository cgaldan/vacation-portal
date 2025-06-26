const vacationRepo = require('../repositories/vacationRepository.js');

async function listRequests(req, res) {
    const { id: userId, role } = req.user;
    const requests = role === 'manager' 
        ? await vacationRepo.listAll() 
        : await vacationRepo.listByUserId(userId);
    res.end(JSON.stringify(requests));
}

async function createRequest(req, res) {
    const { start_date, end_date, reason } = req.body;
    const { id: userId } = req.user;

    if (!start_date || !end_date || !reason) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Missing required fields' })); 
        return;
    }
    
    if (new Date(start_date) > new Date(end_date)) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Start date must be before end date' })); 
        return;
    }

    const request = await vacationRepo.create({ userId, start_date, end_date, reason });
    res.statusCode = 201;
    res.end(JSON.stringify(request));
}

async function deleteRequest(req, res) {
    const { id } = req.params;
    const { id: userId, role } = req.user;
    const request = await vacationRepo.findById(id);
    
    if (!request) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Vacation request not found' })); 
        return;
    }

    if (role !== 'manager' && request.userId !== userId) {
        res.statusCode = 403;
        res.end(JSON.stringify({ error: 'Not allowed to delete this request' })); 
        return;
    }

    if (request.status !== 'pending') {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Only pending requests can be deleted' })); 
        return;
    }

    await vacationRepo.remove(id);
    res.statusCode = 204;
    res.end();
}

async function approveRequest(req, res) {
    const { id } = req.params;
    const updated = await vacationRepo.updateStatus(id, 'approved');
    if (!updated) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Vacation request not found' })); 
        return;
    }
    res.end(JSON.stringify(updated));
}

async function rejectRequest(req, res) {
    const { id } = req.params;
    const updated = await vacationRepo.updateStatus(id, 'rejected');
    if (!updated) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Vacation request not found' })); 
        return;
    }
    res.end(JSON.stringify(updated));
}

export {
    listRequests,
    createRequest,
    deleteRequest,
    approveRequest,
    rejectRequest
}