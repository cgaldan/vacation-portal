/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('vacation_requests').del();
  await knex('users').del();

  await knex('users').insert([
    {
      username: 'manager',
      email: '6Tb0F@example.com',
      password_hash: 'password',
      role: 'manager',
      employee_code: '0000001'
    },
    {
      username: 'employee',
      email: '8tHbO@example.com',
      password_hash: 'password',
      role: 'employee',
      employee_code: '0000002'
    }
  ])
};
