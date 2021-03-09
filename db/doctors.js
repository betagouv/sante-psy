const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)

const doctorsTable = "doctors";

module.exports.doctorsTable = doctorsTable;

module.exports.getDoctorById = async (doctorId) => {
  try {
    const doctor =  await knex(doctorsTable)
      .where("id", doctorId)
      .first();

    return doctor;
  } catch (err) {
    console.error("Erreur de récupération du doctor", err)
    throw new Error("Erreur de récupération du doctor")
  }
}

module.exports.getDoctors = async () => {
  try {
    const doctorArray = await knex(doctorsTable)
        .orderBy("lastName")

    return doctorArray
  } catch (err) {
    console.error(`Impossible de récupérer les doctors`, err)
    throw new Error(`Impossible de récupérer les doctors`)
  }
}

module.exports.insertDoctor = async (firstNames, lastName, address, phone) => {
  try {
    const doctorsArray = await knex(doctorsTable).insert({
      firstNames,
      lastName,
      address,
      phone,
    }).returning('*')
    return doctorsArray[0]
  } catch (err) {
    console.error("Erreur de sauvegarde du doctor", err)
    throw new Error("Erreur de sauvegarde du doctor")
  }
}

module.exports.updateDoctor = async (id, firstNames, lastName, address, phone) => {
  try {
    await knex(doctorsTable)
      .where("id", id)
      .update({
        firstNames,
        lastName,
        address,
        phone
      })
  } catch (err) {
    console.error("Erreur de modification du doctor", err)
    throw new Error("Erreur de modification du doctor")
  }
}
