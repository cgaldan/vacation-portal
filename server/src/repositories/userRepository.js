import db from '../db.js';

async function findByIdentifier(identifier) {
    return db('users')
        .where('email', identifier)
        .orWhere('username', identifier)
        .first();
}

async function findById(id) {
    return db('users')
        .select('id', 'username', 'email', 'role', 'employee_code')
        .where({ id })
        .first();
}

async function listAll() {
    return db('users').select('id', 'username', 'email', 'role', 'employee_code');
}

async function create(user) {
    const [ id ] = await db('users').insert(user);
    return this.findById(id);
}

async function update(id, user) {
    await db('users').where({ id }).update(user);
    return this.findById(id);
}

async function remove(id) {
    return db('users').where({ id }).del();
}

export default {
    findByIdentifier,
    findById,
    listAll,
    create,
    update,
    remove
}