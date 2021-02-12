const db = require('../utils/db')

module.exports.myAppointments = async (req, res) => {
  const appointments = await db.getAppointments()

  res.render('myAppointments', { appointments: appointments })
}

module.exports.newAppointment = async (req, res) => {
  res.render('editAppointment')
}

module.exports.createNewAppointment = async (req, res) => {
  console.log('createNewAppointment', req.body)
  const date = req.body.date
  console.log('date', date, typeof date)
  return res.redirect('/mes-rendez-vous')
}