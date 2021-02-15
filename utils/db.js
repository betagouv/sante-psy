const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)

module.exports.getAppointments = async () => {
  try {
    // todo : look at join or innerjoin to get patient object (and not just id)
    // http://knexjs.org/#Builder-innerJoin
    const appointmentArray = await knex("appointments").select()
        .orderBy("date", "desc")
    return appointmentArray
  } catch (err) {
    console.error(`Impossible de récupérer les appointments`, err)
    throw new Error(`Impossible de récupérer les appointments`)
  }
}

module.exports.insertAppointment = async (date, patientName) => {
  try {
    return await knex("appointments").insert({
      date,
      patientId: 2,
    })
  } catch (err) {
    console.error("Erreur de sauvegarde du appointments", err)
    throw new Error("Erreur de sauvegarde du appointments")
  }
}

module.exports.getPatients = async () => {
  try {
    const patientArray = await knex("patients").select()
        .orderBy("lastName")
    return patientArray
  } catch (err) {
    console.error(`Impossible de récupérer les patients`, err)
    throw new Error(`Impossible de récupérer les patients`)
  }
}

const insertPatient = async (firstNames, lastName, studentNumber, ) => {
  try {
    return await knex("patients").insert({
      firstNames,
      lastName,
      INE: studentNumber,
    })
  } catch (err) {
    console.error("Erreur de sauvegarde du patient", err)
    throw new Error("Erreur de sauvegarde du patient")
  }
}
module.exports.inserPatient = insertPatient

//insertPatient('Emeline', 'M', 1238763438276)
// dans terminal : node db.js


// node 
// const db = require('./utils/db')
// db.insertPatient('Emeline', 'M', 1238763438276)
