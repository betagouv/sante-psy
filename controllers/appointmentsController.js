const cookie = require('../utils/cookie')
const { check } = require('express-validator');
const dbAppointments = require('../db/appointments')
const dbPatient = require('../db/patients')
const dateUtils = require('../utils/date')
const validation = require('../utils/validation')

module.exports.newAppointment = async (req, res) => {
  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    const patients = await dbPatient.getPatients(psychologistId)
    res.render('newAppointment', {patients: patients, pageTitle: "Nouvelle séance"})
  } catch (err) {
    req.flash('error', 'Erreur. La séance n\'est pas créée. Pourriez-vous réessayer ?')
    console.error('Erreur pour créer la séance', err)
    return res.redirect('/psychologue/mes-seances')
  }
}

module.exports.createNewAppointmentValidators = [
  // todo : there is a format option, which would allow using "date" rather than iso-date.
  // Make it work to simplify the html.
  check('iso-date')
    .isDate()
    .withMessage('Vous devez spécifier une date pour la séance.'),
  check('patientId')
    .isUUID()
    .withMessage('Vous devez spécifier un patient pour la séance.'),
]

module.exports.createNewAppointment = async (req, res) => {
  // Todo : test case where patient id does not exist
  if (!validation.checkErrors(req)) {
    return res.redirect('/psychologue/nouvelle-seance')
  }

  const date = new Date(Date.parse(req.body['iso-date']))
  const patientId = req.body['patientId']
  try {
    const psyId = cookie.getCurrentPsyId(req)

    const patientExist = await dbPatient.getPatientById(patientId, psyId);
    if( patientExist ) {
      await dbAppointments.insertAppointment(date, patientId, psyId)
      console.log(`Appointment created for patient id ${patientId} by psy id ${psyId}`)
      req.flash('info', `La séance du ${dateUtils.formatFrenchDate(date)} a bien été créée.`)
    } else {
      console.warn(`Patient id ${patientId} does not exsit for psy id : ${psyId}`);
      req.flash('error', 'Erreur. La séance n\'est pas créée. Pourriez-vous réessayer ?')
    }
    return res.redirect('/psychologue/mes-seances')
  } catch (err) {
    req.flash('error', 'Erreur. La séance n\'est pas créée. Pourriez-vous réessayer ?')
    console.error('Erreur pour créer la séance', err)
    return res.redirect('/psychologue/nouvelle-seance')
  }
}

module.exports.deleteAppointmentValidators = [
  check('appointmentId')
    .isUUID()
    .withMessage('Vous devez spécifier une séance à supprimer.'),
]

// We use a POST rather than a DELETE because method=DELETE in the form seems to send a GET. (???)
module.exports.deleteAppointment = async (req, res) => {
  if (!validation.checkErrors(req)) {
    return res.redirect('/psychologue/mes-seances')
  }

  const appointmentId = req.body['appointmentId']
  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    await dbAppointments.deleteAppointment(appointmentId, psychologistId)
    console.log(`Appointment deleted ${appointmentId} by psy id ${psychologistId}`)
    req.flash('info', `La séance a bien été supprimée.`)
  } catch (err) {
    req.flash('error', 'Erreur. La séance n\'est pas supprimée. Pourriez-vous réessayer ?')
    console.error('Erreur pour supprimer la séance', err)
  }

  return res.redirect('/psychologue/mes-seances')
}
