const cookie = require('../utils/cookie')
const dbAppointments = require('../db/appointments')
const dbPatient = require('../db/patients')
const dbDoctors = require('../db/doctors')

module.exports.dashboard = async function dashboard(req, res) {
  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    const results = await Promise.all([
      dbPatient.getPatients(psychologistId),
      dbAppointments.getAppointments(psychologistId),
      dbDoctors.getDoctorsByPsychologist(psychologistId),
    ])
    const patients = results[0]
    const appointments = results[1]
    const doctors = results[2]

    res.render('dashboard', {
      appointments: appointments,
      patients: patients,
      doctors: doctors,
    });
  } catch (err) {
    req.flash('error', 'Impossible de charger les séances et les patients. Réessayez ultérieurement.')
    console.error('dashboard', err);
    res.render('dashboard', {
      appointments: [],
      patients: [],
      doctors: []
    });
  }
}
