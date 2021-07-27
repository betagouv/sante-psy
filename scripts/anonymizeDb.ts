import faker from 'faker';
import config from '../utils/config';
import { psychologistsTable } from '../db/tables';
import db from '../db/db';

faker.locale = 'fr';

const PROD_HOSTNAME = 'https://santepsy.etudiant.gouv.fr';

const fakeFirstnames = (real: string) : string => real.split(' ').map(() => faker.name.firstName()).join(' ');

const fakeLastname = () : string => faker.name.lastName();

const fakeEmail = (real: string) : string => (real ? faker.internet.exampleEmail() : real);

// eslint-disable-next-line max-len
const fakeAddress = () : string => `${faker.address.streetAddress()} ${faker.address.zipCode('#####')} ${faker.address.city()}`;

const fakePhone = () : string => faker.phone.phoneNumber('0# ## ## ## ##');

// eslint-disable-next-line max-len
const fakeWebsite = (real: string) : string => (real ? faker.helpers.randomize([faker.internet.domainName(), faker.internet.url()]) : real);

const anonymizeDb = async () => {
  if (config.hostnameWithProtocol.startsWith(PROD_HOSTNAME)) {
    console.error("You can't do this on production!");
    process.exit(2);
  }

  console.log('Anonymizing database...');
  try {
    const psyList = await db(psychologistsTable);

    const anonymizePsy = psyList.map((psy) => db(psychologistsTable)
      .where({ dossierNumber: psy.dossierNumber })
      .update({
        firstNames: fakeFirstnames(psy.firstNames),
        lastName: fakeLastname(),
        email: fakeEmail(psy.email),
        address: fakeAddress(),
        phone: fakePhone(),
        website: fakeWebsite(psy.website),
      }));

    await Promise.all(anonymizePsy);

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

anonymizeDb();
