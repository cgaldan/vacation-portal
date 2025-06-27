import db from '../db.js';

async function listAll() {
    return db('vacation_requests').select('*').orderBy('created_at', 'desc');
}

async function listByUserId(userId) {
    return db('vacation_requests').select('*').where({ user_id: userId }).orderBy('created_at', 'desc');
}

async function findById(id) {
    return db('vacation_requests').where({ id }).first();
}

async function create(vacation) {
    const [ id ] = await db('vacation_requests').insert(vacation);
    return this.findById(id);
}

async function remove(id) {
    return db('vacation_requests').where({ id }).del();
}

async function updateStatus(id, status) {
    await db('vacation_requests').where({ id }).update({ status });
    return this.findById(id);
}

export default {
    listAll,
    listByUserId,
    findById,
    create,
    remove,
    updateStatus
}