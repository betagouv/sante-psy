import { Knex } from 'knex';
import faker from 'faker';
import create from '../helper/create';
import { mails } from './02-psychologists';
import uuid from '../../utils/uuid';
import { patientsTable } from '../../db/tables';
import { Psychologist } from '../../types/Psychologist';

let patientsByPsychologist = {};
export const getPatientsByPsychologist = (): {
  [key: string]: Psychologist
} => patientsByPsychologist;

export const seed = async (knex: Knex, fixedValues = false): Promise<void> => {
  patientsByPsychologist = {};
  let patientList;
  if (fixedValues) {
    patientList = mails
    .filter((mail) => mail !== 'empty@beta.gouv.fr')
    .flatMap((mail) => {
      const dossierNumber = uuid.generateFromString(`psychologist-${mail}`);
      patientsByPsychologist[mail] = 5;
      return [
        create.getOnePatient(0, dossierNumber),
        create.getOnePatient(1, dossierNumber),
        create.getOnePatient(2, dossierNumber),
        create.getOnePatient(3, dossierNumber, ''), // incomplete patient's folder doctor
        create.getOneIncompletePatient(4, dossierNumber),
      ];
    });
  } else {
    patientList = mails
    .filter((mail) => mail !== 'empty@beta.gouv.fr')
    .flatMap((mail) => {
      const dossierNumber = uuid.generateFromString(`psychologist-${mail}`);
      const numberOfPatients = faker.datatype.number({ min: 1, max: 25 });
      patientsByPsychologist[mail] = numberOfPatients;
      const patients = [];
      for (let i = 0; i < numberOfPatients; i++) {
        const random = faker.datatype.number();
        if (random % 20 === 0) {
          patients.push(create.getOnePatient(i, dossierNumber, `doctor-${i}`, false));
        } else if (random % 11 === 0) {
          patients.push(create.getOnePatient(i, dossierNumber, ''));
        } else {
          patients.push(create.getOnePatient(i, dossierNumber));
        }
      }
      return patients;
    });
  }

  await knex(patientsTable).insert(patientList);
  console.log(`inserted ${patientList.length} patients to patientsTable`);
};
