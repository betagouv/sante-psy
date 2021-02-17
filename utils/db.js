const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)

module.exports.psychologists = "psychologists";
module.exports.appointments =  "appointments";
module.exports.ds_api_cursor = "ds_api_cursor";

module.exports.getAppointments = async () => {
  try {
    const appointmentArray = await knex(module.exports.appointments).select()
        .orderBy("date", "desc")
    return appointmentArray
  } catch (err) {
    console.error(`Impossible de récupérer les appointments`, err)
    throw new Error(`Impossible de récupérer les appointments`)
  }
}

module.exports.insertAppointment = async (date, patientName) => {
  try {
    return await knex(module.exports.appointments).insert({
      date,
      patientName,
    })
  } catch (err) {
    console.error("Erreur de sauvegarde du appointments", err)
    throw new Error("Erreur de sauvegarde du appointments")
  }
}


module.exports.getPsychologists = async () => {
  try {
    const psychologists = await knex(module.exports.psychologists)
        .select()
        .orderBy("created_at", "desc");

    return psychologists;
  } catch (err) {
    console.error(`Impossible de récupérer les psychologistes`, err)
    throw new Error(`Impossible de récupérer les psychologistes`)
  }
}
