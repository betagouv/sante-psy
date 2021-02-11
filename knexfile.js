const config = require('./utils/config')

module.exports = {
  client: "pg",
  connection: config.databaseUrl,
  acquireConnectionTimeout: 10000,
  migrations: {
    tableName: "knex_migrations"
  }
}
