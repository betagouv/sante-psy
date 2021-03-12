/* eslint-disable func-names */

const dbPsychologists = require("../../db/psychologists")
const dbPatients = require("../../db/patients")
const dbAppointments = require("../../db/appointments")
const demarchesSimplifiees = require("../../utils/demarchesSimplifiees")
const clean = require('../helper/clean');

exports.seed = function(knex) {
  const psyList = [
    clean.getOnePsy('login@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.accepte, false),
    clean.getOnePsy('estelle@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.accepte, false),
    clean.getOnePsy('emeline@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.accepte, false),
    clean.getOnePsy('paul@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.accepte, false),
    clean.getOnePsy(`${clean.getRandomInt()}@beta.gouv.fr`, demarchesSimplifiees.DOSSIER_STATE.accepte, false),
    clean.getOnePsy(`${clean.getRandomInt()}@beta.gouv.fr`, demarchesSimplifiees.DOSSIER_STATE.accepte, false),
    clean.getOnePsy(`${clean.getRandomInt()}@beta.gouv.fr`, demarchesSimplifiees.DOSSIER_STATE.accepte, false),
    clean.getOnePsy(`${clean.getRandomInt()}@beta.gouv.fr`, demarchesSimplifiees.DOSSIER_STATE.accepte, false),
    clean.getOnePsy(`${clean.getRandomInt()}@beta.gouv.fr`, demarchesSimplifiees.DOSSIER_STATE.accepte, false),
    clean.getOnePsy(`${clean.getRandomInt()}@beta.gouv.fr`, demarchesSimplifiees.DOSSIER_STATE.accepte, false),
    clean.getOnePsy('archived@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.accepte, true),
    clean.getOnePsy('empty@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.accepte, true),
    clean.getOnePsy('construction@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.en_construction, false),
    clean.getOnePsy('refuse@beta.gouv.fr', demarchesSimplifiees.DOSSIER_STATE.refuse, false),
  ];

  return knex(dbPsychologists.psychologistsTable).insert(psyList).then(() => {
    console.log(`insert ${psyList.length} fake data to psychologistsTable`);
    // 4 patients by psy except 'empty@beta.gouv.fr'
    const patientList = psyList.filter( psy => psy.personalEmail !== 'empty@beta.gouv.fr')
    .flatMap(function (psy) {
      return [
        clean.getOnePatient(psy.dossierNumber),
        clean.getOnePatient(psy.dossierNumber),
        clean.getOnePatient(psy.dossierNumber),
        clean.getOnePatient(psy.dossierNumber),
      ]
    });
    return knex(dbPatients.patientsTable).insert(patientList).then(() => {
      console.log(`insert ${patientList.length} fake data to patientsTable`);
      // 5 appointments by patients
      const appointmentList = patientList.flatMap(function (patient) {
        return [
          clean.getOneAppointment(patient.id, patient.psychologistId),
          clean.getOneAppointment(patient.id, patient.psychologistId),
          clean.getOneAppointment(patient.id, patient.psychologistId),
          clean.getOneAppointment(patient.id, patient.psychologistId),
          clean.getOneAppointment(patient.id, patient.psychologistId),
        ]
      });

      return knex(dbAppointments.appointmentsTable).insert(appointmentList).then(() => {
        console.log(`insert ${appointmentList.length} fake data to appointmentsTable`);
      });
    });
  });
};