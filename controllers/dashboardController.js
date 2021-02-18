const { result } = require('lodash')
const db = require('../utils/db')

module.exports.dashboard = async function dashboard(req, res) {
  try {
    const results = await Promise.all([db.getPatients(), db.getAppointments()])
    const patients = results[0]
    const appointments = results[1]

    res.render('dashboard', {
      appointments: appointments,
      patients: patients
    });
  } catch (err) {
    req.flash('error', 'Impossible de charger les séances et les patients. Réessayez ultérieurement.')
    console.error('dashboard', err);
    res.render('dashboard', {
      appointments: [],
      patients: []
    });
  }
}
