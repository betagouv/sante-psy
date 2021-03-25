const cookie = require('../utils/cookie')
const dbAppointments = require('../db/appointments')

module.exports.reimbursement = async function reimbursement(req, res) {
  res.render('reimbursement', { pageTitle: 'Remboursement'});
}

module.exports.billing = async function billing(req, res) {
  try {
    const psychologistId = req.sanitize(cookie.getCurrentPsyId(req))
    const totalAppointments = await dbAppointments.getCountAppointmentsByYearMonth(psychologistId);
    const totalPatients = await dbAppointments.getCountPatientsByYearMonth(psychologistId);

    res.render('billing', {
      total: total
    });
  } catch (err) {
    req.flash('error', 'Impossible de charger les séances et les patients. Réessayez ultérieurement.')
    console.error('billing', err);
    res.render('billing', {
      total: []
    });
  }
}
