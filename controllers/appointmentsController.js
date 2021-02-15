const db = require('../utils/db')
const format = require('../utils/format')

module.exports.myAppointments = async (req, res) => {
  const appointments = await db.getAppointments()

  res.render('myAppointments', { appointments: appointments })
}

module.exports.newAppointment = async (req, res) => {
  res.render('newAppointment')
}

module.exports.createNewAppointment = async (req, res) => {
  // todo unit tests for input validation
  const isoDateString = req.body['iso-date']
  const date = new Date(Date.parse(isoDateString))
  if (!isoDateString || isoDateString.length === 0 || isNaN(date)) {
    req.flash('error', 'Vous devez spécifier une date pour la séance.')
    return res.redirect('/nouvelle-seance')
  }

  // todo input validation, check if safe string
  const patientName = req.body['patient-name'].trim()
  if (!patientName || patientName.length === 0) {
    req.flash('error', 'Vous devez spécifier un nom de patient pour la séance.')
    return res.redirect('/nouvelle-seance')
  }

  try {
    await db.insertAppointment(date, patientName)
    req.flash('info', `La séance du ${format.formatFrenchDate(date)} avec ${patientName} a bien été créé.`)
    return res.redirect('/mes-seances')
  } catch (err) {
    req.flash('error', 'Erreur. La séance n\'est pas créée. Vous pouvez réessayer.')
    console.error('Erreur pour créer la séance', err)
    return res.redirect('/nouvelle-seance')
  }
}
