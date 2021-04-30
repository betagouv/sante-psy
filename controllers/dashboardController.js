const cookie = require('../utils/cookie')
const config = require('../utils/config')
const date = require('../utils/date')
const dbAppointments = require('../db/appointments')
const dbPatient = require('../db/patients')

function hasFolderCompleted(patient) {
  let missingInfo = []
  let notEmptyDoctorName = false;
  let notEmptyInstitutionName = false;
  let notEmptyDoctorAddress = false;
  let mandatoryDateOfBirth = false;

  if(patient.doctorName) {
    notEmptyDoctorName = !(!patient.doctorName.trim())
  }

  if(!notEmptyDoctorName) {
    missingInfo.push('nom du docteur')
  }

  if(patient.institutionName) {
    notEmptyInstitutionName = !(!patient.institutionName.trim())

  }
  if(!notEmptyInstitutionName) {
    missingInfo.push('établissement scolaire')
  }

  if(patient.doctorAddress) {
    notEmptyDoctorAddress = !(!patient.doctorAddress.trim())
  }
  if(!notEmptyDoctorAddress) {
    missingInfo.push('adresse du docteur')
  }

  if(patient.dateOfBirth) {
    mandatoryDateOfBirth = true
  } else if ( patient.createdAt <= date.parseDateForm(config.dateOfBirthDeploymentDate) ) {
    mandatoryDateOfBirth = true
  } else {
    missingInfo.push('date de naissance')
  }

  if(!patient.isStudentStatusVerified) {
    missingInfo.push('statut étudiant')
  }

  if(!patient.hasPrescription) {
    missingInfo.push('orientation médicale')
  }

  const hasFolderCompleted = patient.hasPrescription &&
    patient.isStudentStatusVerified &&
    notEmptyDoctorName &&
    notEmptyInstitutionName &&
    notEmptyDoctorAddress &&
    mandatoryDateOfBirth;

  return {
    folderCompleted: hasFolderCompleted,
    missingInfo: missingInfo.join(', '),
  }
}

module.exports.dashboard = async function dashboard(req, res) {
  try {
    let hasAllPatientsWithCompletedFolders = true;
    const psychologistId = cookie.getCurrentPsyId(req)
    const results = await Promise.all([
      dbPatient.getPatients(psychologistId),
      dbAppointments.getAppointments(psychologistId),
    ])
    const patients = results[0]
    const appointments = results[1]

    // @TODO create a function for this
    const patientsWithFolderStatus = patients.map ( patient => {
      const {folderCompleted, missingInfo} = hasFolderCompleted(patient)
      patient.hasFolderCompleted = folderCompleted
      patient.missingInfo = missingInfo

      if(!patient.hasFolderCompleted) {
        hasAllPatientsWithCompletedFolders = false;
      }
      return patient;
    });

    res.render('dashboard', {
      appointments: appointments,
      patients: patientsWithFolderStatus,
      hasAllPatientsWithCompletedFolders: hasAllPatientsWithCompletedFolders,
      announcement: config.announcement,
      dateOfBirthDeploymentDate: config.dateOfBirthDeploymentDate,
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
