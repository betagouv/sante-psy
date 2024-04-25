import config from './utils/config';

export default {
  client: 'pg',
  connection: config.databaseUrl,
  acquireConnectionTimeout: 10000,
  migrations: {
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './test/seed',
    extension: 'ts',
  },
  pool: {
    min: 2,
    max: 10,
  },
};
