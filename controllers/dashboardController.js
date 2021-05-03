const cookie = require('../utils/cookie');
const config = require('../utils/config');
const date = require('../utils/date');
const dbAppointments = require('../db/appointments');
const dbPatient = require('../db/patients');

const DOCTOR_NAME = 'nom du docteur';
const INSTITUTION_NAME = 'établissement scolaire';
const DOCTOR_ADDRESS = 'adresse du docteur';
const BIRTH_DATE = 'date de naissance';
const STUDENT_STATUS = 'statut étudiant';
const PRESCRIPTION = 'orientation médicale';

function hasFolderCompleted(patient) {
  const missingInfo = [];

  if (!patient.doctorName || !patient.doctorName.trim()) {
    missingInfo.push(DOCTOR_NAME);
  }

  if (!patient.institutionName || !patient.institutionName.trim()) {
    missingInfo.push(INSTITUTION_NAME);
  }

  if (!patient.doctorAddress || !patient.doctorAddress.trim()) {
    missingInfo.push(DOCTOR_ADDRESS);
  }

  if (!patient.dateOfBirth && patient.createdAt > date.parseDateForm(config.dateOfBirthDeploymentDate)) {
    missingInfo.push(BIRTH_DATE);
  }

  if (!patient.isStudentStatusVerified) {
    missingInfo.push(STUDENT_STATUS);
  }

  if (!patient.hasPrescription) {
    missingInfo.push(PRESCRIPTION);
  }

  return {
    folderCompleted: missingInfo.length === 0,
    missingInfo: missingInfo.join(', '),
  };
}

module.exports.dashboard = async function dashboard(req, res) {
  try {
    let hasAllPatientsWithCompletedFolders = true;
    const psychologistId = cookie.getCurrentPsyId(req);
    const results = await Promise.all([
      dbPatient.getPatients(psychologistId),
      dbAppointments.getAppointments(psychologistId),
    ]);
    const patients = results[0];
    const appointments = results[1];

    // @TODO create a function for this
    const patientsWithFolderStatus = patients.map((patient) => {
      const { folderCompleted, missingInfo } = hasFolderCompleted(patient);
      patient.hasFolderCompleted = folderCompleted;
      patient.missingInfo = missingInfo;

      if (!patient.hasFolderCompleted) {
        hasAllPatientsWithCompletedFolders = false;
      }
      return patient;
    });

    res.render('dashboard', {
      appointments,
      patients: patientsWithFolderStatus,
      hasAllPatientsWithCompletedFolders,
      announcement: config.announcement,
      dateOfBirthDeploymentDate: config.dateOfBirthDeploymentDate,
    });
  } catch (err) {
    req.flash('error', 'Impossible de charger les séances et les patients. Réessayez ultérieurement.');
    console.error('dashboard', err);
    res.render('dashboard', {
      appointments: [],
      patients: [],
    });
  }
};
