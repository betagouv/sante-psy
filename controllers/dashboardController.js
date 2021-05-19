const cookie = require('../utils/cookie');
const config = require('../utils/config');
const date = require('../utils/date');
const dbAppointments = require('../db/appointments');
const dbPatient = require('../db/patients');
const dbPsychologists = require('../db/psychologists');
const getAnnouncement = require('../utils/announcement');

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

async function displayAppointments(req, res) {
  try {
    const monthPicker = req.body && req.body.isoDate ? new Date(req.body.isoDate) : new Date();
    const psychologistId = cookie.getCurrentPsyId(req);
    const appointments = await dbAppointments.getAppointments(psychologistId);

    const conventionInfo = await dbPsychologists.getConventionInfo(psychologistId);
    const currentConvention = conventionInfo === undefined
      ? { universityId: undefined, universityName: undefined, isConventionSigned: false }
      : conventionInfo;

    res.render('myAppointments', {
      appointments: appointments.filter((appointment) => date.isSameMonth(appointment.appointmentDate, monthPicker)),
      monthPicker,
      currentConvention,
      ...getAnnouncement(req),
    });
  } catch (err) {
    req.flash('error', 'Impossible de charger les séances. Réessayez ultérieurement.');
    console.error('myAppointments', err);
    res.render('myAppointments', {
      appointments: [],
      monthPicker: new Date(),
    });
  }
}

async function displayPatients(req, res) {
  try {
    const psychologistId = cookie.getCurrentPsyId(req);
    const patients = await dbPatient.getPatients(psychologistId);

    patients.forEach((patient) => {
      const { folderCompleted, missingInfo } = hasFolderCompleted(patient);
      patient.hasFolderCompleted = folderCompleted;
      patient.missingInfo = missingInfo;
    });

    res.render('myPatients', {
      patients,
      dateOfBirthDeploymentDate: config.dateOfBirthDeploymentDate,
      ...getAnnouncement(req),
    });
  } catch (err) {
    req.flash('error', 'Impossible de charger les les patients. Réessayez ultérieurement.');
    console.error('myPatients', err);
    res.render('myPatients', {
      patients: [],
    });
  }
}

module.exports = {
  displayAppointments,
  displayPatients,
};
