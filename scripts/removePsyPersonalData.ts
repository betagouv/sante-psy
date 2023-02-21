import db from '../db/db';
import { psychologistsTable } from '../db/tables';
import dbPsychologists from '../db/psychologists';

const removePsyPersonalData = async (dossierNumber: string): Promise<void> => {
  console.log('Removing personal data for psychologist', dossierNumber);

  try {
    const psychologist = await dbPsychologists.getById(dossierNumber);

    if (!psychologist) {
      console.log('Psychologist not found!');
      console.log("Help: you should specify the dossierNumber, it's a uuid");
      process.exit(1);
    }

    if (psychologist.active && psychologist.archived) {
      console.log('Psychologist is still displayed in public list!');
      console.log('Help: archive the dossier in DS or ask him/her to deactivate his/her account');
    }

    const erasedData = '-';
    await db(psychologistsTable)
      .where({ dossierNumber })
      .update({
        selfModified: true,
        firstNames: erasedData,
        lastName: erasedData,
        adeli: erasedData,
        email: erasedData,
        address: erasedData,
        city: erasedData,
        postcode: erasedData,
        longitude: null,
        latitude: null,
        otherAddress: erasedData,
        otherCity: erasedData,
        otherPostcode: erasedData,
        otherLongitude: null,
        otherLatitude: null,
        phone: erasedData,
        website: erasedData,
        description: erasedData,
        personalEmail: erasedData,
        useFirstNames: erasedData,
        useLastName: erasedData,
      });

    console.log('Done!');
    console.log('Remember to also clean data from integrated tools (emailing, DS, etc.)');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(2);
  }
};

if (process.argv.length <= 2) {
  console.log('Invalid: you should specify psychologist id as argument');
  process.exit(1);
}

removePsyPersonalData(process.argv[2]);
