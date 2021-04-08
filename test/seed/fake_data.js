/* eslint-disable max-len */
/* eslint-disable func-names */

const dbPsychologists = require("../../db/psychologists")
const dbPatients = require("../../db/patients")
const dbAppointments = require("../../db/appointments")
const dbUniversities = require("../../db/universities")
const demarchesSimplifiees = require("../../utils/demarchesSimplifiees")
const clean = require('../helper/clean');
const uuid = require('../../utils/uuid');

module.exports.testUniversityUuid = function getTestUniversityUuid(random = Math.random().toString()) {
  return uuid.generateUuidFromString(random);
}

exports.seed = async function(knex) {

  // A few universities
  const universitiesList = [
    {
      id: module.exports.testUniversityUuid(),
      name: '--- Aucune pour le moment'
    },
    {
      id: module.exports.testUniversityUuid(),
      name: 'Clermont-Ferrand'
    },
    {
      id: module.exports.testUniversityUuid(),
      name: 'Grenoble'
    },
    {
      id: module.exports.testUniversityUuid(),
      name: 'Aix-Marseille'
    },
    {
      id: module.exports.testUniversityUuid(),
      name: 'Créteil Paris Est'
    },
  ]

  await knex(dbUniversities.universitiesTable).insert(universitiesList)
  console.log(`inserted ${universitiesList.length} fake data to universitiesTable`);

  const psyList = universitiesList.filter( university => university.name !== '--- Aucune pour le moment')
  .flatMap(function (university) {

    return [
      clean.getOnePsy('login@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.accepte, false, university.id),
      clean.getOnePsy('estelle.comment@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.accepte, false, university.id),
      clean.getOnePsy('emeline.merliere@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.accepte, false, university.id),
      clean.getOnePsy('paul.leclercq@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.accepte, false, university.id),
      clean.getOnePsy('julien.dauphant@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.accepte, false, university.id),
      clean.getOnePsy(`${clean.getRandomInt()}@beta.gouv.fr`, demarchesSimplifiees.DOSSIER_STATE.accepte, false, university.id),
      clean.getOnePsy(`${clean.getRandomInt()}@beta.gouv.fr`, demarchesSimplifiees.DOSSIER_STATE.accepte, false, university.id),
      clean.getOnePsy(`${clean.getRandomInt()}@beta.gouv.fr`, demarchesSimplifiees.DOSSIER_STATE.accepte, false, university.id),
      clean.getOnePsy(`${clean.getRandomInt()}@beta.gouv.fr`, demarchesSimplifiees.DOSSIER_STATE.accepte, false, university.id),
      clean.getOnePsy(`${clean.getRandomInt()}@beta.gouv.fr`, demarchesSimplifiees.DOSSIER_STATE.accepte, false, university.id),
      clean.getOnePsy(`${clean.getRandomInt()}@beta.gouv.fr`, demarchesSimplifiees.DOSSIER_STATE.accepte, false, university.id),
      clean.getOnePsy('archived@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.accepte, true, university.id),
      clean.getOnePsy('empty@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.accepte, true, university.id),
      clean.getOnePsy('construction@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.en_construction, false, university.id),
      clean.getOnePsy('refuse@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.refuse, false, university.id)
    ]
  });


  await knex(dbPsychologists.psychologistsTable).insert(psyList)
  console.log(`inserted ${psyList.length} fake data to psychologistsTable`);

  // 4 patients by psy except 'empty@beta.gouv.fr'
  const patientList = psyList.filter( psy => psy.personalEmail !== 'empty@beta.gouv.fr')
  .flatMap(function (psy) {
    return [
      clean.getOnePatient(psy.dossierNumber),
      clean.getOnePatient(psy.dossierNumber),
      clean.getOnePatient(psy.dossierNumber),
      clean.getOnePatient(psy.dossierNumber),
      clean.getOnePatient(psy.dossierNumber, ""), // incomplete patient's folder
    ]
  });

  await knex(dbPatients.patientsTable).insert(patientList)
  console.log(`inserted ${patientList.length} fake data to patientsTable`);

  // 5 appointments by patients
  const appointmentList = patientList.flatMap(function (patient) {
    return [
      clean.getOneAppointment(patient.id, patient.psychologistId),
      clean.getOneAppointment(patient.id, patient.psychologistId),
      clean.getOneAppointment(patient.id, patient.psychologistId),
      clean.getOneAppointment(patient.id, patient.psychologistId, 4),
      clean.getOneAppointment(patient.id, patient.psychologistId, 5),
      clean.getOneAppointment(patient.id, patient.psychologistId, 6),
      clean.getOneAppointment(patient.id, patient.psychologistId, 10),
    ]
  });

  await knex(dbAppointments.appointmentsTable).insert(appointmentList)
  console.log(`inserted ${appointmentList.length} fake data to appointmentsTable`);

};