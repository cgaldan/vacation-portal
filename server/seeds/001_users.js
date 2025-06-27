/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;

export async function seed(knex) {
  await knex('users').del();

  const passwordHash = await bcrypt.hash('password', SALT_ROUNDS);

  await knex('users').insert([
    {
      username: 'John_Doe',
      email: 'john.doe@example.com',
      password_hash: passwordHash,
      role: 'manager',
      employee_code: '0000001'
    },
    {
      username: 'Jane_Doe',
      email: 'jane.doe@example.com',
      password_hash: passwordHash,
      role: 'employee',
      employee_code: '0000002'
    }
  ])
};
