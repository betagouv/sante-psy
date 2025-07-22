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
    const sharedPatients = [
      {
        lastName: 'Maxime',
        firstNames: 'SharedPatient1',
        INE: '12345678910',
        isINESvalid: true,
        index: [0, 1],
      },
      {
        lastName: 'Laure',
        firstNames: 'SharedPatient2',
        INE: '280324352792',
        index: [0, 1],
        isINESvalid: false,
      },
    ];
    patientList = mails
      .filter((mail) => mail !== 'empty@beta.gouv.fr')
      .flatMap((mail, index) => {
        const dossierNumber = uuid.generateFromString(`psychologist-${mail}`);
        patientsByPsychologist[mail] = 5;
        const sharedPatientsForPsychologist = sharedPatients.filter(
          (sharedPatient) => sharedPatient.index.includes(index),
        );
        let patients = [];
        patients.push(create.getOnePatient(0, {
          psychologistId: dossierNumber,
          doctorName: '',
        }));

        // Add shared patients with same INE for psychologist matching index.
        patients = patients.concat(
          sharedPatientsForPsychologist.map((sharedPatient, i) => create.getOnePatient(i + patients.length, {
            psychologistId: dossierNumber,
            lastName: sharedPatient.lastName,
            firstNames: sharedPatient.firstNames,
            INE: sharedPatient.INE,
            isINESvalid: sharedPatient.isINESvalid,
          })),
        );

        patients.push(create.getOneIncompletePatient(patients.length, {
          psychologistId: dossierNumber,
          lastName: 'Patient',
          firstNames: 'Arenouvelé',
        }));

        const remainingPatientCount = 5 - patients.length;

        for (let i = 0; i < remainingPatientCount; i++) {
          patients.push(
            create.getOnePatient(i + patients.length, {
              psychologistId: dossierNumber,
            }),
          );
        }
        return patients;
      });
  } else {
    const sharedPatients = [];
    patientList = mails
      .filter((mail) => mail !== 'empty@beta.gouv.fr')
      .flatMap((mail) => {
        const dossierNumber = uuid.generateFromString(`psychologist-${mail}`);
        const numberOfPatients = faker.datatype.number({ min: 5, max: 15 });
        patientsByPsychologist[mail] = numberOfPatients;
        const patients = [];
        const selectedPatients = [];

        for (let i = 0; i < numberOfPatients; i++) {
          const random = faker.datatype.number();

          const patientData: {
            psychologistId: string,
            INE?: string,
            doctorName?: string,
            gender?: string,
            dateOfBirth?: Date,
            firstNames?: string,
            lastName?: string
          } = {
            psychologistId: dossierNumber,
          };

          if (sharedPatients.length > 0) {
            if (random % 15 === 0) {
              const randomIndex = Math.floor(Math.random() * sharedPatients.length);
              patientData.INE = sharedPatients[randomIndex].INE;
              patientData.gender = sharedPatients[randomIndex].gender;
              patientData.firstNames = sharedPatients[randomIndex].firstNames;
              patientData.lastName = sharedPatients[randomIndex].lastName;
              sharedPatients.splice(randomIndex, 1);
            }
          }

          if (random % 20 === 0) {
            patientData.doctorName = `doctor-${i}`;
            patientData.dateOfBirth = null;
          } else if (random % 11 === 0) {
            patientData.doctorName = '';
          }

          patients.push(create.getOnePatient(i, patientData));

          if (sharedPatients.length === 0) {
            selectedPatients.push(patients[patients.length - 1]);
          }
        }
        if (sharedPatients.length === 0) {
          const numberOfSelectedPatients = Math.floor(Math.random() * selectedPatients.length) + 1;

          for (let i = 0; i < numberOfSelectedPatients; i++) {
            const randomIndex = Math.floor(Math.random() * selectedPatients.length);
            sharedPatients.push(selectedPatients[randomIndex]);
            selectedPatients.splice(randomIndex, 1);
          }
        }

        return patients;
      });
  }

  await knex(patientsTable).insert(patientList);
  console.log(`inserted ${patientList.length} patients to patientsTable`);
};
