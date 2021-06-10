/* eslint-disable max-len */
/* eslint-disable func-names */

const dbPsychologists = require('../../db/psychologists');
const dbPatients = require('../../db/patients');
const dbAppointments = require('../../db/appointments');
const dbUniversities = require('../../db/universities');
const dbLoginToken = require('../../db/loginToken');
const demarchesSimplifiees = require('../../utils/demarchesSimplifiees');
const clean = require('../helper/clean');
const uuid = require('../../utils/uuid');

exports.seed = async function (knex) {
  console.log('Clean database information');

  await knex(dbLoginToken.loginTokenTable).del();
  await knex(dbPatients.patientsTable).del();
  await knex(dbPsychologists.psychologistsTable).del();
  await knex(dbUniversities.universitiesTable).del();
  await knex(dbUniversities.universitiesTable).del();

  const universitiesList = dbUniversities.universities.map((uni) => ({
    name: uni,
    id: uuid.randomUuid(),
    emailUniversity: `${clean.getRandomInt()}@beta.gouv.fr ; ${clean.getRandomInt()}@beta.gouv.fr`,
    emailSSU: `${clean.getRandomInt()}@beta.gouv.fr ; ${clean.getRandomInt()}@beta.gouv.fr`,
  }));

  await knex(dbUniversities.universitiesTable).insert(universitiesList);
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
    ...mails.map((mail) => clean.getOnePsy(mail, demarchesSimplifiees.DOSSIER_STATE.accepte, false, university.id)),
    ...[...Array(5).keys()].map(() => clean.getOnePsy(`${clean.getRandomInt()}@beta.gouv.fr`, demarchesSimplifiees.DOSSIER_STATE.accepte, false)),
    clean.getOnePsy('archived@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.accepte, true),
    clean.getOnePsy('empty@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.accepte, true),
    clean.getOnePsy('construction@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.en_construction, false),
    clean.getOnePsy('refuse@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.refuse, false),
  ];

  await knex(dbPsychologists.psychologistsTable).insert(psyList);
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

  await knex(dbPatients.patientsTable).insert(patientList);
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

  await knex(dbAppointments.appointmentsTable).insert(appointmentList);
  console.log(`inserted ${appointmentList.length} fake data to appointmentsTable`);
};
