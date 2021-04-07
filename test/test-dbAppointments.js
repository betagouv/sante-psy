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

  describe('getCountAppointmentsByYearMonth', () => {
    it('should return a count of appointments by year and month', async () => {
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

      const patient2 = await dbPatients.insertPatient(
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
      await dbAppointments.insertAppointment(new Date('2021-03-02'), patient2.id, psy.dossierNumber)
      await dbAppointments.insertAppointment(new Date('2021-03-03'), patient.id, psy.dossierNumber)
      await dbAppointments.insertAppointment(new Date('2021-03-03'), patient2.id, psy.dossierNumber)
      await dbAppointments.insertAppointment(new Date('2021-04-03'), patient.id, psy.dossierNumber)
      await dbAppointments.insertAppointment(new Date('2021-06-03'), patient.id, psy.dossierNumber)
      await dbAppointments.insertAppointment(new Date('2021-07-03'), patient.id, psy.dossierNumber)

      const output = await dbAppointments.getCountAppointmentsByYearMonth(psy.dossierNumber);

      assert(output.length === 4); // 4 months
      assert(output[0].countAppointments === 4);
      assert(output[0].year === 2021);
      assert(output[0].month === 3);
      assert(output[1].countAppointments === 1);
      assert(output[1].year === 2021);
      assert(output[1].month === 4);
      assert(output[2].countAppointments === 1);
      assert(output[2].year === 2021);
      assert(output[2].month === 6);
      assert(output[3].countAppointments === 1);
      assert(output[3].year === 2021);
      assert(output[3].month === 7);
    });
  });

  describe('getCountAppointmentsByYearMonthForUniversity', () => {
    it('should return a count of appointments by year and month for university', async () => {
      const month = 4
      const year = 2021
      const psyList = [
        clean.getOnePsy('loginemail@beta.gouv.fr', 'accepte', false, '25173f41-6535-524f-bec0-436297a2bc77'),
        clean.getOnePsy('emaillogin@beta.gouv.fr', 'accepte', false, '14f37152-6535-524f-bec0-436297a2bc77')
      ]
      await dbPsychologists.savePsychologistInPG(psyList);

      const psy = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[0].personalEmail)
      const psy2 = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[1].personalEmail)
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

      const patient2 = await dbPatients.insertPatient(
        patientToInsert.firstNames,
        patientToInsert.lastName,
        patientToInsert.INE,
        patientToInsert.institutionName,
        patientToInsert.isStudentStatusVerified,
        patientToInsert.hasPrescription,
        psy2.dossierNumber,
        patientToInsert.doctorName,
        patientToInsert.doctorAddress,
        patientToInsert.doctorPhone,
      )
      await dbAppointments.insertAppointment(new Date('2021-03-01'), patient.id, psy.dossierNumber)
      await dbAppointments.insertAppointment(new Date('2021-03-02'), patient2.id, psy2.dossierNumber)
      await dbAppointments.insertAppointment(new Date('2021-04-03'), patient.id, psy.dossierNumber)
      await dbAppointments.insertAppointment(new Date('2021-04-03'), patient2.id, psy2.dossierNumber)
      await dbAppointments.insertAppointment(new Date('2021-04-03'), patient.id, psy.dossierNumber)


      const output = await dbAppointments.getCountAppointmentsByYearMonthForUniversity(year, month);
      console.log(output)
      assert(output.length === 2); // 2 university
      assert(output[0].countAppointments === 2);
      assert(output[1].countAppointments === 1);
    });
  });

  describe('getCountPatientsByYearMonth', () => {
    it('should return a count of patients by year and month', async () => {
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
      const patient2 = await dbPatients.insertPatient(
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
      // 4 appointments in march with 2 patients
      await dbAppointments.insertAppointment(new Date('2021-03-01'), patient.id, psy.dossierNumber)
      await dbAppointments.insertAppointment(new Date('2021-03-02'), patient.id, psy.dossierNumber)
      await dbAppointments.insertAppointment(new Date('2021-03-03'), patient.id, psy.dossierNumber)
      await dbAppointments.insertAppointment(new Date('2021-03-03'), patient2.id, psy.dossierNumber)
      // one in april
      await dbAppointments.insertAppointment(new Date('2021-04-03'), patient.id, psy.dossierNumber)
      // one in june
      await dbAppointments.insertAppointment(new Date('2021-06-03'), patient.id, psy.dossierNumber)
      // one in july
      await dbAppointments.insertAppointment(new Date('2021-07-03'), patient.id, psy.dossierNumber)

      const output = await dbAppointments.getCountPatientsByYearMonth(psy.dossierNumber);

      assert.equal(output.length, 4); // 4 months
      assert.equal(output[0].countPatients, 2);
      assert.equal(output[0].year, 2021);
      assert.equal(output[0].month, 3);

      assert.equal(output[1].countPatients, 1);
      assert.equal(output[1].year, 2021);
      assert.equal(output[1].month, 4);
      assert.equal(output[2].countPatients, 1);
      assert.equal(output[2].year, 2021);
      assert.equal(output[2].month, 6);
      assert.equal(output[3].countPatients, 1);
      assert.equal(output[3].year, 2021);
      assert.equal(output[3].month, 7);
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

      assert.equal(output.length, 3);
      assert.equal(output[0].psychologistId, psy.dossierNumber);
      assert.equal(output[1].psychologistId, psy.dossierNumber);
      assert.equal(output[2].psychologistId, psy.dossierNumber);
    });
  });
});