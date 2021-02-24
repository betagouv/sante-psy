const dbAppointments = require('../db/appointments')
const dbPatient = require('../db/patients')

module.exports.dashboard = async function dashboard(req, res) {
  try {
    const results = await Promise.all([dbPatient.getPatients(), dbAppointments.getAppointments()])
    const patients = results[0]
    const appointments = results[1]

    res.render('dashboard', {
      appointments: appointments,
      patients: patients
    });
  } catch (err) {
    req.flash('error', 'Impossible de charger les séances et les patients. Réessayez ultérieurement.')
    console.error('dashboard', err);
    res.render('dashboard', {
      appointments: [],
      patients: []
    });
  }
}
