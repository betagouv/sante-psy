const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)
const dbPatient = require('./patients')
const dbPsychologists = require('./psychologists')
const date = require("../utils/date");

const appointmentsTable = "appointments"
module.exports.appointmentsTable = appointmentsTable;

// todo: bug : if appointment has a patientId that does not match a patient object in the db,
// this function returns empty.
module.exports.getAppointments = async (psychologistId) => {
  try {
    const appointmentArray = await knex.from(dbPatient.patientsTable)
      .innerJoin(`${appointmentsTable}`, `${dbPatient.patientsTable}.id`, `${appointmentsTable}.patientId`)
      .where(`${appointmentsTable}.psychologistId`, psychologistId)
      .whereNot(`${appointmentsTable}.deleted`, true)
      .orderBy("appointmentDate", "desc")
    return appointmentArray
  } catch (err) {
    console.error(`Impossible de récupérer les appointments`, err)
    throw new Error(`Impossible de récupérer les appointments`)
  }
}

/**
 * Note : january = 1, february = 2, etc
 * Example output :
 * [
 *  {countAppointments: 3, year: 2021, month: 3, psychologistId: '112323232-33434-3434'},
 *  {countAppointments: 2, year: 2021, month: 4, psychologistId: '112323232-33434-3434'},
 * ]
 */
module.exports.getCountAppointmentsByYearMonth = async (psychologistId) => {
  try {
    const query = await knex(appointmentsTable)
      .select(knex.raw(`CAST(COUNT(*) AS INTEGER) AS "countAppointments"
        , "psychologistId"
        , EXTRACT(YEAR from "appointmentDate") AS year
        , EXTRACT(MONTH from "appointmentDate") AS month`))
      .where("psychologistId", psychologistId)
      .groupByRaw(`"psychologistId"
        , EXTRACT(YEAR from "appointmentDate")
        , EXTRACT(MONTH from "appointmentDate")`)
      .orderBy([{ column: 'year', order: 'asc'}, { column: 'month', order: 'asc' }])

    return query;
  } catch (err) {
    console.error(`Impossible de récupérer les appointments`, err)
    throw new Error(`Impossible de récupérer les appointments`)
  }
}

/**
 * Note : january = 1, february = 2, etc
 * Example output :
 * [
 *  {countAppointments: 3, psychologistId: '112323232-33434-3434',  universityId: '15555523232-33434-3434'},
 *  {countAppointments: 2, psychologistId: '112323232-33434-3434, universityId: '15555523232-33434-3434''},
 * ]
 */
module.exports.getCountAppointmentsByYearMonthForUniversity = async (year, month) => {
  try {
    const query = await knex(appointmentsTable)
      .select(knex.raw(`CAST(COUNT(*) AS INTEGER) AS "countAppointments"
        , ${appointmentsTable}."psychologistId"
        , ${dbPsychologists.psychologistsTable}."payingUniversityId" AS universityId
        `))
        .whereRaw(`EXTRACT(YEAR from ${appointmentsTable}."appointmentDate") = ${year}`)
        .andWhereRaw(`EXTRACT(MONTH from ${appointmentsTable}."appointmentDate") = ${month}`)
        .innerJoin(`${dbPsychologists.psychologistsTable}`,
          `${appointmentsTable}.psychologistId`,
          `${dbPsychologists.psychologistsTable}.dossierNumber`)
      .groupBy(`${appointmentsTable}.psychologistId`)
      .groupBy(`${dbPsychologists.psychologistsTable}.payingUniversityId`)

    return  query;
  } catch (err) {
    console.error(`Impossible de récupérer les appointments`, err)
    throw new Error(`Impossible de récupérer les appointments`)
  }
}

/**
 * Note : january = 1, february = 2, etc
 * Example output :
 * [
 *  {countPatients: 3, year: 2021, month: 3},
 *  {countPatients: 2, year: 2021, month: 4},
 * ]
 */
module.exports.getCountPatientsByYearMonth = async (psychologistId) => {
  try {
    const query = await knex(appointmentsTable)
      .select(knex.raw(`CAST(COUNT(DISTINCT "patientId") AS INTEGER) AS "countPatients"
        , EXTRACT(YEAR from "appointmentDate") AS year
        , EXTRACT(MONTH from "appointmentDate") AS month`))
      .where("psychologistId", psychologistId)
      .groupByRaw(`EXTRACT(YEAR from "appointmentDate")
        , EXTRACT(MONTH from "appointmentDate")`)
      .orderBy([{ column: 'year', order: 'asc'}, { column: 'month', order: 'asc' }])
    return query;
  } catch (err) {
    console.error(`Impossible de récupérer les appointments`, err)
    throw new Error(`Impossible de récupérer les appointments`)
  }
}

module.exports.insertAppointment = async (appointmentDate, patientId, psychologistId) => {
  try {
    const insertedArray = await knex(appointmentsTable).insert({
      psychologistId,
      appointmentDate,
      patientId: patientId,
    }).returning("*")
    return insertedArray[0]
  } catch (err) {
    console.error("Erreur de sauvegarde du appointments", err)
    throw new Error("Erreur de sauvegarde du appointments")
  }
}

module.exports.deleteAppointment = async (appointmentId, psychologistId) => {
  try {
    const deletedAppointments = await knex(appointmentsTable)
      .where({
        id: appointmentId,
        psychologistId: psychologistId
      })
      .update({
        deleted: true,
        updatedAt: date.getDateNowPG()
      })

    console.log(`Appointment id ${appointmentId} deleted by psy id ${psychologistId}`);

    return deletedAppointments
  } catch (err) {
    console.error("Erreur de suppression du appointments", err)
    throw new Error("Erreur de suppression du appointments")
  }
}
