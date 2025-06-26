/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

exports.seed = async function(knex) {
  await knex('vacation_requests').del();
  await knex('users').del();

  const passwordHash = await bcrypt.hash('password', SALT_ROUNDS);

  await knex('users').insert([
    {
      username: 'manager',
      email: '6Tb0F@example.com',
      password_hash: passwordHash,
      role: 'manager',
      employee_code: '0000001'
    },
    {
      username: 'employee',
      email: '8tHbO@example.com',
      password_hash: passwordHash,
      role: 'employee',
      employee_code: '0000002'
    }
  ])
};
