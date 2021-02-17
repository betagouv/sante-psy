const db = require('../utils/db')

module.exports.getAppointmentsAndPatients = async function getAppointmentsAndPatients(req, res) {
  try {
    const patients = await db.getPatients()
    const appointments = await db.getAppointments()

    res.render('dashboard', {
      appointments: appointments,
      patients: patients
    });
  } catch (err) {
    console.error('getAppointmentsAndPatients', err);
    res.render('dashboard', {
      appointments: [],
      patients: [],
      errors: [err],
    });
  }
}
