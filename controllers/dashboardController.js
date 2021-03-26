const cookie = require('../utils/cookie')
const dbAppointments = require('../db/appointments')
const dbPatient = require('../db/patients')

function hasFolderCompleted(patient) {
  let notEmptyDoctorName = false;
  let notEmptyInstitutionName = false;
  let notEmptyDoctorAddress = false;
  if(patient.doctorName) {
    notEmptyDoctorName = !(!patient.doctorName.trim())
  }
  if(patient.institutionName) {
    notEmptyInstitutionName = !(!patient.institutionName.trim())
  }

  if(patient.doctorAddress) {
    notEmptyDoctorAddress = !(!patient.doctorAddress.trim())
  }

  return !!(patient.INE) && patient.hasPrescription && patient.isStudentStatusVerified && notEmptyDoctorName &&
  notEmptyInstitutionName && notEmptyDoctorAddress;
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
