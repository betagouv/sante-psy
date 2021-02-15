const config = require('./utils/config')

const knexConfig = {
  client: "pg",
  connection: config.databaseUrl,
  acquireConnectionTimeout: 10000,
  migrations: {
    tableName: "knex_migrations"
  }
}

console.log('got knexConfig', knexConfig)
module.exports = knexConfig
