const dbUniversities = require('../db/universities')

const runInsert = async () => {
  for (const university of dbUniversities.universities) {
    try {
      await dbUniversities.insertUniversity(university)
      console.log('inserted', university)
    } catch (err) {
      console.error('Could not insert', university, err)
    }
  }
}

return runInsert()
