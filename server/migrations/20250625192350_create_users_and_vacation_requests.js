/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema

    .createTable('users', (table) => {
        table.increments('id').primary();
        table.string('username').notNullable().unique();
        table.string('email').notNullable().unique();
        table.string('password_hash').notNullable();
        table.enu('role', ['manager', 'employee'])
            .notNullable()
            .defaultTo('employee');
        table.string('employee_code', 7).notNullable().unique();
    })

    .createTable('vacation_requests', (table) => {
        table.increments('id').primary();
        table
            .integer('user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table.date('start_date').notNullable();
        table.date('end_date').notNullable();
        table.string('reason').notNullable();
        table.enu('status', ['pending', 'approved', 'rejected'])
            .notNullable()
            .defaultTo('pending');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema
        .dropTableIfExists('vacation_requests')
        .dropTableIfExists('users');
};
