import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
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
          create.getOnePatient(0, { psychologistId: dossierNumber }),
          create.getOnePatient(1, { psychologistId: dossierNumber }),
          create.getOnePatient(2, { psychologistId: dossierNumber }),
          create.getOnePatient(3, { psychologistId: dossierNumber, doctorName: '' }),
          create.getOneIncompletePatient(4, {
            psychologistId: dossierNumber,
            lastName: 'Patient',
            firstNames: 'Arenouvelé',
            hasPrescription: false,
          }),
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
            patients.push(create.getOnePatient(i, {
              psychologistId: dossierNumber, doctorName: `doctor-${i}`, dateOfBirth: null,
            }));
          } else if (random % 11 === 0) {
            patients.push(create.getOnePatient(i, { psychologistId: dossierNumber, doctorName: '' }));
          } else {
            patients.push(create.getOnePatient(i, { psychologistId: dossierNumber }));
          }
        }
        return patients;
      });
  }

  await knex(patientsTable).insert(patientList);
  console.log(`inserted ${patientList.length} patients to patientsTable`);
};
