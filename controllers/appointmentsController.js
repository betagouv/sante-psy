const db = require('../utils/db')

module.exports.myAppointments = async (req, res) => {
  const appointments = await db.getAppointments()

  res.render('myAppointments', { appointments: appointments })
}

module.exports.newAppointment = async (req, res) => {
  res.render('newAppointment')
}

module.exports.createNewAppointment = async (req, res) => {
  // todo input validation, check if present, check if safe string
  const dateString = req.body.date
  const patientName = req.body['patient-name']

  function parseDate(dateString) {
    var m = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    return (m) ? new Date(m[3], m[2]-1, m[1]) : null;
  }
  const date = parseDate(dateString)

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