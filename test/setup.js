require('dotenv').config()

const { parse } = require("pg-connection-string")
const chai = require("chai")
const chaiHttp = require("chai-http")

chai.use(chaiHttp)
chai.should()

if (process.env.DATABASE_URL) {
  const config = parse(process.env.DATABASE_URL);
  const testDbName = `${config.database}__test`;
  console.log(`Overriding DATABASE_URL for test with database : ${testDbName}`);
  const parts = {
    user: encodeURIComponent(config.user),
    pass: encodeURIComponent(config.password),
    host: encodeURIComponent(config.host),
    port: encodeURIComponent(config.port),
    db: encodeURIComponent(testDbName),
  }
  process.env.DATABASE_URL = `postgres://${parts.user}:${parts.pass}@${parts.host}:${parts.port}/${parts.db}`;
} else {
  console.log('Environment variable DATABASE_URL not found');
}

console.log("Done test setup")
