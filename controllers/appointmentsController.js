const dateUtils = require('../utils/date')
const dbAppointments = require('../db/appointments')
const dbPatient = require('../db/patients')
const format = require('../utils/format')
const { validationResult } = require('express-validator');

module.exports.newAppointment = async (req, res) => {
  const patients = await dbPatient.getPatients()
  res.render('newAppointment', {patients: patients, pageTitle: "Nouvelle séance"})
}

module.exports.createNewAppointment = async (req, res) => {
  // todo unit tests for input validation
  // Todo : test case where patient id does not exist
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach(error => {
      if (error.param === 'iso-date') {
        req.flash('error', 'Vous devez spécifier une date pour la séance.')
      }
      if (error.param === 'patientId') {
        req.flash('error', 'Vous devez spécifier un patient pour la séance.')
      }
    })
    return res.redirect('/nouvelle-seance')
  }

  const date = new Date(Date.parse(req.body['iso-date']))
  const patientId = req.body['patientId']
  try {
    await dbAppointments.insertAppointment(date, patientId)
    req.flash('info', `La séance du ${format.formatFrenchDate(date)} a bien été créé.`)
    return res.redirect('/mes-seances')
  } catch (err) {
    req.flash('error', 'Erreur. La séance n\'est pas créée. Pourriez-vous réessayer ?')
    console.error('Erreur pour créer la séance', err)
    return res.redirect('/nouvelle-seance')
  }
}

// We use a POST rather than a DELETE because method=DELETE in the form seems to send a GET. (???)
module.exports.deleteAppointment = async (req, res) => {
  // todo think about validation
  const appointmentId = req.body['appointmentId']

  try {
    await dbAppointments.deleteAppointment(appointmentId)
    req.flash('info', `La séance a bien été supprimée.`)
  } catch (err) {
    req.flash('error', 'Erreur. La séance n\'est pas supprimée. Pourriez-vous réessayer ?')
    console.error('Erreur pour supprimer la séance', err)
  }

  return res.redirect('/mes-seances')
}
