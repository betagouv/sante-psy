const { check } = require('express-validator');
const dbAppointments = require('../db/appointments');
const dbPatient = require('../db/patients');
const dbPsychologists = require('../db/psychologists');
const dateUtils = require('../utils/date');
const validation = require('../utils/validation');

module.exports.createNewAppointmentValidators = [
  check('date')
    .isISO8601()
    .withMessage('Vous devez spécifier une date pour la séance.'),
  check('patientId')
    .isUUID()
    .withMessage('Vous devez spécifier un patient pour la séance.'),
];

module.exports.createNewAppointment = async (req, res) => {
  // Todo : test case where patient id does not exist
  if (!validation.checkErrors(req)) {
    return res.json({ success: false, message: req.error });
  }

  const date = new Date(req.body.date);
  const { patientId } = req.body;
  try {
    const psyId = req.user.psychologist;
    const patientExist = await dbPatient.getPatientById(patientId, psyId);

    if (patientExist) {
      await dbAppointments.insertAppointment(date, patientId, psyId);
      console.log(
        `Appointment created for patient id ${patientId} by psy id ${psyId}`,
      );
      return res.json({
        success: true,
        message: `La séance du ${dateUtils.formatFrenchDate(date)} a bien été créée.`,
      });
    }

    console.warn(
      `Patient id ${patientId} does not exist for psy id : ${psyId}`,
    );
  } catch (err) {
    console.error('Erreur pour créer la séance', err);
  }

  return res.json({
    success: false,
    message: "Erreur. La séance n'est pas créée. Pourriez-vous réessayer ?",
  });
};

module.exports.deleteAppointmentValidators = [
  check('appointmentId')
    .isUUID()
    .withMessage('Vous devez spécifier une séance à supprimer.'),
];

module.exports.deleteAppointment = async (req, res) => {
  if (!validation.checkErrors(req)) {
    return res.json({ success: false, message: req.error });
  }

  try {
    const { appointmentId } = req.params;
    const psychologistId = req.user.psychologist;
    const deletedAppointment = await dbAppointments.deleteAppointment(appointmentId, psychologistId);
    if (deletedAppointment === 0) {
      console.log(
        `Appointment ${appointmentId} does not belong to psy id ${psychologistId}`,
      );
      return res.json({
        success: false,
        message: 'Impossible de supprimer cette séance.',
      });
    }
    console.log(
      `Appointment deleted ${appointmentId} by psy id ${psychologistId}`,
    );
    return res.json({
      success: true,
      message: 'La séance a bien été supprimée.',
    });
  } catch (err) {
    console.error('Erreur pour supprimer la séance', err);
    return res.json({
      success: false,
      message: "Erreur. La séance n'est pas supprimée. Pourriez-vous réessayer ?",
    });
  }
};

module.exports.getAppointments = async (req, res) => {
  try {
    const psychologistId = req.user.psychologist;
    const appointments = await dbAppointments.getAppointments(psychologistId);

    const currentConvention = await dbPsychologists.getConventionInfo(psychologistId);

    return res.json({ success: true, appointments, currentConvention });
  } catch (err) {
    console.error('myAppointments', err);
    return res.json({
      appointments: [],
      success: false,
      message: 'Impossible de charger les séances. Réessayez ultérieurement.',
    });
  }
};
