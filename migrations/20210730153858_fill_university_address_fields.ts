import { Knex } from 'knex';
import universities from '../utils/frEsrUniversities';

export async function up(knex: Knex): Promise<any[]> {
  const promises = [];
  universities.forEach((university) => {
    promises.push(knex('universities')
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

  console.log('Add addresses to', promises.length, 'universities');
  return Promise.all(promises);
}

export async function down(knex: Knex): Promise<void> {
  return knex('universities').update({
    siret: null,
    address: null,
    postal_code: null,
    city: null,
  });
}
