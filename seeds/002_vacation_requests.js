/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

export async function seed(knex) {
  await knex('vacation_requests').del();
  
  await knex('vacation_requests').insert([
    {
      user_id: 1,
      start_date: '2023-06-01',
      end_date: '2023-06-05',
      reason: 'Vacation',
      status: 'pending'
    },
    {
      user_id: 2,
      start_date: '2023-06-10',
      end_date: '2023-06-15',
      reason: 'Sick leave',
      status: 'approved'
    },
    {
      user_id: 1,
      start_date: '2023-06-20',
      end_date: '2023-06-25',
      reason: 'Business trip',
      status: 'rejected'
    }
  ]);
}