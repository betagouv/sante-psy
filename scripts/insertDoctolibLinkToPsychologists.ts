/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import db from '../db/db';
import { psychologistsTable } from '../db/tables';
import { Psychologist } from '../types/Psychologist';

type DoctolibPsy = {
  id: number,
  prenom: string,
  nom: string,
  lienDoctolib: string,
}

const matchDoctolibToDb = (doctolibName: string, dbName: string): boolean => dbName.toLowerCase().includes(doctolibName.toLowerCase());

const insertDoctolibLinkToPsy = async (doctolibPsys: unknown[]): Promise<void> => {
  console.log(
    'Adding appointmentLink to psychologists with Doctolib profiles...',
  );

  try {
    const psysDb = await db(psychologistsTable) as Psychologist[];

    for (const doctolibPsy of doctolibPsys as DoctolibPsy[]) {
      if (!(doctolibPsy.prenom && doctolibPsy.nom && doctolibPsy.lienDoctolib)) {
        continue;
      }
      const matchingPsys = psysDb
      .filter((psyDb) => matchDoctolibToDb(doctolibPsy.nom, psyDb.lastName))
      .filter((psyDb) => matchDoctolibToDb(doctolibPsy.prenom, psyDb.firstNames));

      if (matchingPsys.length === 0) {
        console.warn(
          `Couldn't find corresponding psy for psy ${doctolibPsy.prenom} ${doctolibPsy.nom} of excel`,
        );
        continue;
      }

      if (matchingPsys.length > 1) {
        console.warn(`Multiple matches found for ${doctolibPsy.prenom} ${doctolibPsy.nom}`);
        continue;
      }

      const psy = matchingPsys[0];

      try {
        await db(psychologistsTable)
          .where({ dossierNumber: psy.dossierNumber })
          .update({ appointmentLink: doctolibPsy.lienDoctolib });
      } catch (err) {
        console.error(err);
        continue;
      }

      console.log(
        `Updated Doctolib link for psy id ${psy.dossierNumber} of database`,
      );
    }

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const parseFile = (): void => {
  const filePath = process.argv[2];
  fs.readFile(filePath, (err, datum) => {
    if (err) {
      console.log(err);
      return;
    }
    const separator = ';';
    const buffStr = datum.toString();
    const [headerLine, ...lines] = buffStr.split('\n');
    const headers = headerLine.split(separator).map((header) => header.trim());
    console.log(headers);

    const data = lines.map((line) => {
      const values = line.split(separator).map((value) => value.trim());
      return Object.fromEntries(
        headers.map((header, index) => [header, values[index]]),
      );
    });

    insertDoctolibLinkToPsy(data);
  });
};

parseFile();
