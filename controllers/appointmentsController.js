const cookie = require('../utils/cookie')
const dateUtils = require('../utils/date')
const dbAppointments = require('../db/appointments')
const dbPatient = require('../db/patients')
const format = require('../utils/format')

module.exports.newAppointment = async (req, res) => {
  const patients = await dbPatient.getPatients()
  res.render('newAppointment', {patients: patients, pageTitle: "Nouvelle séance"})
}

module.exports.createNewAppointment = async (req, res) => {
  // todo unit tests for input validation
  const isoDateString = req.body['iso-date']

  if (!dateUtils.isValidDate(isoDateString)) {
    req.flash('error', 'Vous devez spécifier une date pour la séance.')
    return res.redirect('/nouvelle-seance')
  }

  // Todo : test case where patient id does not exist
  const patientId = req.body['patientId']
  if (!patientId || patientId === 0) {
    req.flash('error', 'Vous devez spécifier un nom de patient pour la séance.')
    return res.redirect('/nouvelle-seance')
  }

  const date = new Date(Date.parse(isoDateString))

  try {
    const psyId = cookie.getCurrentPsyId(req)
    await dbAppointments.insertAppointment(date, patientId, psyId)
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
    const psychologistId = cookie.getCurrentPsyId(req)
    await dbAppointments.deleteAppointment(appointmentId, psychologistId)
    req.flash('info', `La séance a bien été supprimée.`)
  } catch (err) {
    req.flash('error', 'Erreur. La séance n\'est pas supprimée. Pourriez-vous réessayer ?')
    console.error('Erreur pour supprimer la séance', err)
  }

  return res.redirect('/mes-seances')
}
