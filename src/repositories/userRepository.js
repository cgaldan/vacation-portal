const db = require('../db');

async function findByEmail(email) {
    return db('users').where({ email }).first();
}

async function findById(id) {
    return db('users')
        .select('id', 'username', 'email', 'role', 'employee_code')
        .where({ id }).first()
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

module.exports = {
    findByEmail,
    findById,
    listAll,
    create,
    update,
    remove
}
