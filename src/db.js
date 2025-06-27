import 'dotenv/config';
import knex from 'knex';
import knexfile from '../knexfile.js';

const env = process.env.NODE_ENV || 'development';
const config = knexfile[env];

const db = knex(config);

export default db;