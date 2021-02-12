const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)

module.exports.getAppointments = async () => {
  try {
    const appointmentArray = await knex("appointments").select()
        .orderBy("date", "desc")
    return appointmentArray
  } catch (err) {
    console.error(`Impossible de récupérer les appointments`, err)
    throw new Error(`Impossible de récupérer les appointments`)
  }
}

const insertAppointment = async (date, patientName) => {
  try {
    return await knex("appointments").insert({
      date,
      patientName,
    })
  } catch (err) {
    console.error("Erreur de sauvegarde du appointments", err)
    throw new Error("Erreur de sauvegarde du appointments")
  }
}
module.exports.insertAppointment = insertAppointment