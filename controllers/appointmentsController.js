const db = require('../utils/db')

module.exports.myAppointments = async (req, res) => {
  const appointments = await db.getAppointments()

  res.render('myAppointments', { appointments: appointments })
}

module.exports.newAppointment = async (req, res) => {
  res.render('newAppointment')
}

module.exports.createNewAppointment = async (req, res) => {
  const dateString = req.body.date
  const isoDateString = req.body['iso-date']
  const date = new Date(Date.parse(isoDateString))
  if (!isoDateString || isoDateString.length === 0 || isNaN(date)) {
    req.flash('error', 'Vous devez spécifier une date pour le rendez-vous.')
    return res.redirect('/nouveau-rendez-vous')
  }

  // todo input validation, check if safe string
  const patientName = req.body['patient-name'].trim()
  if (!patientName || patientName.length === 0) {
    req.flash('error', 'Vous devez spécifier un nom de patient pour le rendez-vous.')
    return res.redirect('/nouveau-rendez-vous')
  }

  try {
    await db.insertAppointment(date, patientName)
    req.flash('info', `Le rendez-vous du ${dateString} avec ${patientName} a bien été créé.`)
    return res.redirect('/mes-rendez-vous')
  } catch (err) {
    req.flash('error', 'Erreur. Le rendez-vous n\'est pas créé. Vous pouvez réessayer.')
    console.error('Erreur pour créer le rendez-vous', err)
    return res.redirect('/nouveau-rendez-vous')
  }
}