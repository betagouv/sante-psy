console.log('DATABASE_URL', process.env.DATABASE_URL)

module.exports = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  acquireConnectionTimeout: 10000,
  migrations: {
    tableName: "knex_migrations"
  }
}
