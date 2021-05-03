const dbUniversities = require('../db/universities');

const runInsert = async () => {
  const universitiesSavedInDB = await dbUniversities.getUniversities();

  if (universitiesSavedInDB.length === 0) { // to avoid duplicates
    for (const university of dbUniversities.universities) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await dbUniversities.insertUniversity(university);
        console.log('inserted', university);
      } catch (err) {
        console.error('Could not insert', university, err);
      }
    }
  } else {
    console.log(
      'Universities have already been inserted - '
       + 'you need to do this manually if you want to update the universities list',
    );
  }

  // eslint-disable-next-line no-process-exit
  process.exit(1);
};

return runInsert();
