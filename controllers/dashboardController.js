const cookie = require('../utils/cookie')
const dbAppointments = require('../db/appointments')
const dbPatient = require('../db/patients')

function hasFolderCompleted(patient) {
  return (patient.INE !== '') && patient.hasPrescription && patient.isStudentStatusVerified &&
  patient.institutionName && (patient.doctorName !== null) && (patient.institutionName !== null)
}

module.exports.dashboard = async function dashboard(req, res) {
  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    const results = await Promise.all([
      dbPatient.getPatients(psychologistId),
      dbAppointments.getAppointments(psychologistId),
    ])
    const patients = results[0]
    const appointments = results[1]

    const patientsWithFolderStatus = patients.map ( patient => {
      patient.hasFolderCompleted = hasFolderCompleted(patient)
      return patient;
    });

    res.render('dashboard', {
      appointments: appointments,
      patients: patientsWithFolderStatus
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
