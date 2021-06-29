import clean from '../helper/clean';

import uuid from '../../utils/uuid';
import {
  appointmentsTable,
} from '../../db/tables';

import { getPatientsByPsychologist } from './03-patients';
import { Knex } from 'knex';

const getOneAppointmentPerMonth = (patient, day, deleted = false) => [...Array(12).keys()]
  .map((i) => clean.getOneAppointment(patient.id, patient.psychologistId, i, day, deleted));

// eslint-disable-next-line import/prefer-default-export
export const seed = async (knex: Knex, fixedValues = false): Promise<void> => {
  const patientsByPsychologist = getPatientsByPsychologist();
  const patientList = Object.keys(patientsByPsychologist)
    .flatMap((psychologist) => {
      const dossierNumber = uuid.generateUuidFromString(`psychologist-${psychologist}`);
      return [...Array(patientsByPsychologist[psychologist]).keys()].map((i) => ({
        id: uuid.generateUuidFromString(`patient-${dossierNumber}-${i}`),
        psychologistId: dossierNumber,
      }));
    });

  let appointmentList;
  if (fixedValues) {
    appointmentList = [];
    // Patient 0 => One appointment deleted
    appointmentList = appointmentList.concat(getOneAppointmentPerMonth(patientList[0], 10, true));
    // Patient 1 => 3 appointements => 5 10 and 15
    appointmentList = appointmentList.concat(getOneAppointmentPerMonth(patientList[1], 5));
    appointmentList = appointmentList.concat(getOneAppointmentPerMonth(patientList[1], 10));
    appointmentList = appointmentList.concat(getOneAppointmentPerMonth(patientList[1], 15));
    // Patient 2 => 5 appointements => 2 on the 5, 10, 20 and 25
    appointmentList = appointmentList.concat(getOneAppointmentPerMonth(patientList[2], 5));
    appointmentList = appointmentList.concat(getOneAppointmentPerMonth(patientList[2], 5));
    appointmentList = appointmentList.concat(getOneAppointmentPerMonth(patientList[2], 10));
    appointmentList = appointmentList.concat(getOneAppointmentPerMonth(patientList[2], 20));
    appointmentList = appointmentList.concat(getOneAppointmentPerMonth(patientList[2], 25));
    // Patient 3 => 5 appointments on the 1, 
    appointmentList = appointmentList.concat(getOneAppointmentPerMonth(patientList[3], 1));
    appointmentList = appointmentList.concat(getOneAppointmentPerMonth(patientList[3], 1));
    appointmentList = appointmentList.concat(getOneAppointmentPerMonth(patientList[3], 1));
    appointmentList = appointmentList.concat(getOneAppointmentPerMonth(patientList[3], 1));
    appointmentList = appointmentList.concat(getOneAppointmentPerMonth(patientList[3], 1));
  } else {
    appointmentList = patientList.flatMap((patient) => {
      const getRandomDay = () => Math.floor((Math.random() * 30) + 1);
      const getRandomMonth = () => Math.floor((Math.random() * 12) + 1);
      const nbOfAppointments = Math.random() * 10;
      const result = [];
      for (let i = 0; i < nbOfAppointments; i++) {
        const month = getRandomMonth();
        const day = getRandomDay();
        const appointmentPerDay = Math.random() * 5 + 1;
        for (let j = 0; j < appointmentPerDay; j++) {
          result.push(clean.getOneAppointment(patient.id, patient.psychologistId, month, day));
        }
      }
      return result;
    });
  }

  await knex(appointmentsTable).insert(appointmentList);
  console.log(`inserted ${appointmentList.length} appointments to appointmentsTable`);
};
