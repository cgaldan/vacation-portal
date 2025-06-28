import 'dotenv/config';

export default {
  development: {
    client: 'sqlite3',
    connection: { filename: process.env.DB_FILE || './data.sqlite' },
    useNullAsDefault: true,
    migrations: { directory: './migrations' },
    seeds:      { directory: './seeds' },
  },

  test: {
    client: 'sqlite3',
    connection: { filename: ':memory:' },
    useNullAsDefault: true,
    migrations: { directory: './migrations' },
    seeds:      { directory: './seeds' },
  }
}