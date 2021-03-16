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
    it('should change deleted boolean to true and update updatedAt field', async () => {
      const psyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[0].personalEmail)
      const patientToInsert = clean.getOnePatient(psy.dossierNumber)
      const patient = await dbPatients.insertPatient(
        patientToInsert.firstNames,
        patientToInsert.lastName,
        patientToInsert.INE,
        patientToInsert.institutionName,
        patientToInsert.isStudentStatusVerified,
        patientToInsert.hasPrescription,
        psy.dossierNumber,
        patientToInsert.doctorName,
        patientToInsert.doctorAddress,
        patientToInsert.doctorPhone,
      )
      await dbAppointments.insertAppointment(new Date('2021-03-01'), patient.id, psy.dossierNumber)

      const appointmentsBeforeDelete =  await knex.from(dbAppointments.appointmentsTable)
      .where("psychologistId", psy.dossierNumber)
      .where("patientId", patient.id)

      assert(appointmentsBeforeDelete[0].updatedAt === null)
      assert(appointmentsBeforeDelete[0].deleted === false);
      await dbAppointments.deleteAppointment(appointmentsBeforeDelete[0].id, psy.dossierNumber)

      const appointmentsAfterDelete =  await knex.from(dbAppointments.appointmentsTable)
      .where("psychologistId", psy.dossierNumber)
      .where("patientId", patient.id)
      assert(appointmentsAfterDelete[0].deleted === true);
      assert(appointmentsAfterDelete[0].updatedAt !== null);
    });
  });

  describe('getAppointments', () => {
    it('should only return not deleted appointments for psy id', async () => {
      const psyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[0].personalEmail)
      const patientToInsert = clean.getOnePatient(psy.dossierNumber)
      const patient = await dbPatients.insertPatient(
        patientToInsert.firstNames,
        patientToInsert.lastName,
        patientToInsert.INE,
        patientToInsert.institutionName,
        patientToInsert.isStudentStatusVerified,
        patientToInsert.hasPrescription,
        psy.dossierNumber,
        patientToInsert.doctorName,
        patientToInsert.doctorAddress,
        patientToInsert.doctorPhone,
      )
      const toDelete = await dbAppointments.insertAppointment(new Date('2021-03-01'), patient.id, psy.dossierNumber)
      await dbAppointments.insertAppointment(new Date('2021-03-02'), patient.id, psy.dossierNumber)
      await dbAppointments.insertAppointment(new Date('2021-03-03'), patient.id, psy.dossierNumber)

      await dbAppointments.deleteAppointment(toDelete.id, psy.dossierNumber)

      const output = await dbAppointments.getAppointments(psy.dossierNumber);

      assert(output.length === 2);
      assert(output[0].deleted === false);
      assert(output[1].deleted === false);
    });

    it('should only return psy id appointments', async () => {
      const psyList = clean.psyList(); //@TODO add another psy
      let anotherPsy = Object.assign({}, psyList[0]);
      anotherPsy.dossierNumber = "b2e447cd-2d57-4f83-8884-ab05a2633644";

      await dbPsychologists.savePsychologistInPG([psyList[0], anotherPsy]);
      const psy = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[0].personalEmail)
      const patientToInsert = clean.getOnePatient(psy.dossierNumber)
      const patient = await dbPatients.insertPatient(
        patientToInsert.firstNames,
        patientToInsert.lastName,
        patientToInsert.INE,
        patientToInsert.institutionName,
        patientToInsert.isStudentStatusVerified,
        patientToInsert.hasPrescription,
        psy.dossierNumber,
        patientToInsert.doctorName,
        patientToInsert.doctorAddress,
        patientToInsert.doctorPhone,
      )

      await dbAppointments.insertAppointment(new Date('2021-03-02'), patient.id, psy.dossierNumber)
      await dbAppointments.insertAppointment(new Date('2021-03-03'), patient.id, psy.dossierNumber)
      await dbAppointments.insertAppointment(new Date('2021-03-04'), patient.id, psy.dossierNumber)
      await dbAppointments.insertAppointment(new Date('2021-03-03'), patient.id, anotherPsy.dossierNumber)

      const output = await dbAppointments.getAppointments(psy.dossierNumber);

      assert(output.length === 3);
      assert(output[0].psychologistId === psy.dossierNumber);
      assert(output[1].psychologistId === psy.dossierNumber);
      assert(output[2].psychologistId === psy.dossierNumber);
    });
  });
});