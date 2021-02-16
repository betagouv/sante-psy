const dateUtils = require('../utils/date')
const db = require('../utils/db')
const format = require('../utils/format')

module.exports.myAppointments = async (req, res) => {
  const appointments = await db.getAppointments()
  res.render('myAppointments', { appointments: appointments })
}

module.exports.newAppointment = async (req, res) => {
  const patients = await db.getPatients()
  res.render('newAppointment', {patients: patients})
}

module.exports.createNewAppointment = async (req, res) => {
  // todo unit tests for input validation
  const isoDateString = req.body['iso-date']

  if (!dateUtils.isValidDate(isoDateString)) {
    req.flash('error', 'Vous devez spécifier une date pour la séance.')
    return res.redirect('/nouvelle-seance')
  }

  // todo input validation, check if safe string
  const patientId = req.body['patientId']
  if (!patientId || patientId === 0) {
    req.flash('error', 'Vous devez spécifier un nom de patient pour la séance.')
    return res.redirect('/nouvelle-seance')
  }

  const date = new Date(Date.parse(isoDateString))
  try {
    await db.insertAppointment(date, patientId)
    req.flash('info', `La séance du ${format.formatFrenchDate(date)} a bien été créé.`)
    return res.redirect('/mes-seances')
  } catch (err) {
    req.flash('error', 'Erreur. La séance n\'est pas créée. Pourriez vous réessayer ?')
    console.error('Erreur pour créer la séance', err)
    return res.redirect('/nouvelle-seance')
  }
}
