const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)

module.exports.universitiesTable =  "universities";