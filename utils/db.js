// TODO knex-client in a separate file is probably useless ?
const knex = require("../knex-client")

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

module.exports.insertEmptyAppointment = async () => {
  try {
    return await knex("appointments").insert({
      date : new Date(),
    })
  } catch (err) {
    console.error("Erreur de sauvegarde du appointments", err)
    throw new Error("Erreur de sauvegarde du appointments")
  }
}
