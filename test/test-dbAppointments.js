require('dotenv').config();
const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)
const assert = require('chai').assert;
const dbAppointments = require('../db/appointments')
const dbPatients = require('../db/patients')
const dbPsychologists = require('../db/psychologists')
const clean = require('./helper/clean');

describe('DB Appointments', () => {
  beforeEach(async function before() {
    await clean.cleanAllPatients();
    await clean.cleanAllPsychologists();
    await clean.cleanDataAppointments();
  })

  describe('deleteAppointment', () => {

    it('should change deleted boolean to true', async () => {
      const psyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[0].personalEmail)
      const patientToInsert = clean.getOnePatient(psy.dossierNumber)
      const patient = await dbPatients.insertPatient(patientToInsert.firstNames, patientToInsert.lastName);

      await dbAppointments.insertAppointment(new Date('2021-03-01'), patient.id, psy.dossierNumber)
      await dbAppointments.deleteAppointment(appointments[0].id, psy.dossierNumber)

      const appointments =  await knex.from(dbAppointments.appointmentsTable)
      .where("psychologistId", psy.dossierNumber)
      .where("patientId", patient.id)

      assert(appointments[0].deleted === true);
      assert(appointments[0].updatedAt !== undefined);
    });
  });

  describe('getAppointments', () => {
    it('should return not deleted appointments for psy id', async () => {
      const psyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[0].personalEmail)
      const patient = await dbPatients.insertPatient(clean.getOnePatient(psy.dossierNumber));
      await dbAppointments.insertAppointment(new Date('2021-03-01'), patient.id, psy.dossierNumber)
      const appointments = await dbAppointments.getAppointments(psy.dossierNumber);
      console.log("appointments", appointments)
      await dbAppointments.deleteAppointment(appointments[0].id, psy.dossierNumber)
      const output = await dbAppointments.getAppointments(psy.dossierNumber);

      assert(output.length === 0);
    });

    it('should return not deleted appointments for psy id', async () => {
      const psyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[0].personalEmail)
      const patient = await dbPatients.insertPatient(clean.getOnePatient(psy.dossierNumber));
      await dbAppointments.insertAppointment(new Date('2021-03-01'), patient.id, psy.dossierNumber)
      const appointments = await dbAppointments.getAppointments(psy.dossierNumber);
      await dbAppointments.deleteAppointment(appointments[0].id, psy.dossierNumber)
      const output = await dbAppointments.getAppointments(psy.dossierNumber);
      assert(output === undefined);
    });
  });
});