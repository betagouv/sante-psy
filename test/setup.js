require('dotenv').config()

const chai = require("chai")
const chaiHttp = require("chai-http")
const testUtils = require('./utils')

chai.use(chaiHttp)
chai.should()

const { parse } = require('pg-connection-string');

if (process.env.DATABASE_URL) {
  const config = parse(process.env.DATABASE_URL);
  const testDbName = `${config.database}__test`;
  console.log(`Overriding DATABASE_URL for test with database : ${testDbName}`);
  // eslint-disable-next-line max-len
  process.env.DATABASE_URL = `postgres://${encodeURIComponent(config.user)}:${encodeURIComponent(config.password)}@${encodeURIComponent(config.host)}:${encodeURIComponent(config.port)}/${encodeURIComponent(testDbName)}`;
} else {
  console.log('Environment variable DATABASE_URL not found');
}

before(async () => {
  console.log('BEFORE EVERYTHING')
  await testUtils.setupTestDatabase()
  return Promise.resolve() // needed for async test
})
after(async () => {
  console.log('AFTER EVERYTHING')
  return await testUtils.cleanUpTestDatabase
})

console.log("Done test setup")
