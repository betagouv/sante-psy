import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import create from '../helper/create';
import uuid from '../../utils/uuid';
import {
  appointmentsTable,
} from '../../db/tables';
import { getPatientsByPsychologist } from './03-patients';
import { Appointment } from '../../types/Appointment';

const getOneAppointmentPerMonth = (patient: {id: string, psychologistId: string}, day: number, deleted = false)
  : Appointment[] => [...Array(12).keys()]
  .map((i) => create.getOneAppointment({
    patientId: patient.id,
    psychologistId: patient.psychologistId,
    appointmentDate: new Date(2022, i, day).toISOString(),
    deleted,
  }));

// eslint-disable-next-line import/prefer-default-export
export const seed = async (knex: Knex, fixedValues = false): Promise<void> => {
  const patientsByPsychologist = getPatientsByPsychologist();
  const patientList = Object.keys(patientsByPsychologist)
    .flatMap((psychologist) => {
      const dossierNumber = uuid.generateFromString(`psychologist-${psychologist}`);
      return [...Array(patientsByPsychologist[psychologist]).keys()].map((i) => ({
        id: uuid.generateFromString(`patient-${dossierNumber}-${i}`),
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
      const nbOfAppointments = faker.datatype.number(10);
      const result = [];
      for (let i = 0; i < nbOfAppointments; i++) {
        result.push(create.getOneAppointment({
          patientId: patient.id,
          psychologistId: patient.psychologistId,
          appointmentDate: faker.date.future().toISOString(),
        }));
      }
      return result;
    });
  }

  await knex(appointmentsTable).insert(appointmentList);
  console.log(`inserted ${appointmentList.length} appointments to appointmentsTable`);
};
