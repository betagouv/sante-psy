import db from '../db/db';
import { universitiesTable } from '../db/tables';
import universities from '../utils/frEsrUniversities';

const insertAddressToUniversities = async () => {
  console.log('Filling siret & address fields to universities...');

  const promises = [];
  try {
    universities.forEach((university) => {
      promises.push(db(universitiesTable)
      .where({ name: university.name })
      .update({
        siret: university.siret,
        address: [
          university.address1,
          university.address2,
          university.address3,
          university.address3,
        ].join(' '),
        postal_code: university.postal_code,
        city: university.city,
      }));
    });

    await Promise.all(promises);

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

insertAddressToUniversities();
