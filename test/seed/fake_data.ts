/* eslint-disable func-names */

import clean from '../helper/clean';

import uuid from '../../utils/uuid';
import universities from '../../utils/universities';
import { DOSSIER_STATE } from '../../utils/dossierState';
import {
  appointmentsTable,
  loginTokenTable,
  patientsTable,
  psychologistsTable,
  universitiesTable,
  suspensionReasonsTable,
} from '../../db/tables';

exports.seed = async function (knex) {
  console.log('Clean database information');

  await knex(suspensionReasonsTable).del();
  await knex(loginTokenTable).del();
  await knex(appointmentsTable).del();
  await knex(patientsTable).del();
  await knex(psychologistsTable).del();
  await knex(universitiesTable).del();

  const universitiesList = universities.map((uni) => ({
    name: uni,
    id: uuid.randomUuid(),
    emailUniversity: `${clean.getRandomInt()}@beta.gouv.fr ; ${clean.getRandomInt()}@beta.gouv.fr`,
    emailSSU: `${clean.getRandomInt()}@beta.gouv.fr ; ${clean.getRandomInt()}@beta.gouv.fr`,
  }));

  await knex(universitiesTable).insert(universitiesList);
  console.log(`inserted ${universitiesList.length} fake data to universitiesTable`);

  const university = universitiesList.find((u) => u.name !== '--- Aucune pour le moment');

  const mails = [
    'login@beta.gouv.fr',
    'estelle.comment@beta.gouv.fr',
    'emeline.merliere@beta.gouv.fr',
    'paul.leclercq@beta.gouv.fr',
    'julien.dauphant@beta.gouv.fr',
    'xavier.desoindre@beta.gouv.fr',
    'sandrine.ricardo@beta.gouv.fr',
    'christophe.mamfoumbiphalente@beta.gouv.fr',
    'damir.sagadbekov@beta.gouv.fr',
    'paul.burgun@beta.gouv.fr',
    'lina.cham@beta.gouv.fr',
  ];

  const psyList = [
    ...mails.map((mail) => clean.getOnePsy(mail, DOSSIER_STATE.accepte, false, university.id)),
    ...[...Array(5).keys()]
      .map(() => clean.getOnePsy(`${clean.getRandomInt()}@beta.gouv.fr`, DOSSIER_STATE.accepte, false)),
    clean.getOnePsy('archived@beta.gouv.fr', DOSSIER_STATE.accepte, true),
    clean.getOnePsy('empty@beta.gouv.fr', DOSSIER_STATE.accepte, true),
    clean.getOnePsy('construction@beta.gouv.fr', DOSSIER_STATE.en_construction, false),
    clean.getOnePsy('refuse@beta.gouv.fr', DOSSIER_STATE.refuse, false),
  ];

  await knex(psychologistsTable).insert(psyList);
  console.log(`inserted ${psyList.length} fake data to psychologistsTable`);

  // 4 patients by psy except 'empty@beta.gouv.fr'
  const patientList = psyList.filter((psy) => psy.personalEmail !== 'empty@beta.gouv.fr')
  .flatMap((psy) => [
    clean.getOnePatient(psy.dossierNumber),
    clean.getOnePatient(psy.dossierNumber),
    clean.getOnePatient(psy.dossierNumber),
    clean.getOnePatient(psy.dossierNumber, ''), // incomplete patient's folder doctor
    clean.getOnePatient(psy.dossierNumber, 'doctorName', false), // incomplete patient's folder : date of birth
  ]);

  await knex(patientsTable).insert(patientList);
  console.log(`inserted ${patientList.length} fake data to patientsTable`);

  // 5 appointments by patients
  const appointmentList = patientList.flatMap((patient) => [
    clean.getOneAppointment(patient.id, patient.psychologistId, 2), // 2 === march
    clean.getOneAppointment(patient.id, patient.psychologistId, 2), // 2 === march
    clean.getOneAppointment(patient.id, patient.psychologistId, 3), // 3 === april
    clean.getOneAppointment(patient.id, patient.psychologistId, 4), // you got it ;)
    clean.getOneAppointment(patient.id, patient.psychologistId, 5),
    clean.getOneAppointment(patient.id, patient.psychologistId, 6),
    clean.getOneAppointment(patient.id, patient.psychologistId, 10),
  ]);

  await knex(appointmentsTable).insert(appointmentList);
  console.log(`inserted ${appointmentList.length} fake data to appointmentsTable`);
};