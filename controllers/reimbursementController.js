const { check } = require('express-validator');
const dbAppointments = require('../db/appointments');
const cookie = require('../utils/cookie');
const date = require('../utils/date');
const dbPsychologists = require('../db/psychologists');
const dbUniversities = require('../db/universities');
const validation = require('../utils/validation');

function mergeTotalPatientAppointments(totalAppointments, totalPatients) {
  return totalPatients.map((totalPatient) => {
    const appointForMonthYear = totalAppointments.find(
      (appointment) => appointment.year === totalPatient.year && appointment.month === totalPatient.month,
    );

    return {
      year: totalPatient.year,
      month: date.getFrenchMonthName(totalPatient.month),
      countPatients: totalPatient.countPatients,
      countAppointments: appointForMonthYear ? appointForMonthYear.countAppointments : 0,
    };
  });
}

async function getTotalAppointmentsAndPatientByPsy(req) {
  const psychologistId = req.sanitize(cookie.getCurrentPsyId(req));
  const totalAppointments = await dbAppointments.getCountAppointmentsByYearMonth(psychologistId);
  const totalPatients = await dbAppointments.getCountPatientsByYearMonth(psychologistId);
  return mergeTotalPatientAppointments(totalAppointments, totalPatients);
}

module.exports.reimbursement = async function reimbursement(req, res) {
  let universityList = [];
  try {
    universityList = await dbUniversities.getUniversities();

    // used to place "-- nothing yet" in first position
    universityList.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });
  } catch (err) {
    console.error('Could not fetch universities', err);
    req.flash('error', 'La page Remboursement n\'arrive pas à s\'afficher.');
    return res.redirect('/psychologue/mes-seances');
  }

  try {
    const psychologistId = cookie.getCurrentPsyId(req);
    const currentConvention = await dbPsychologists.getConventionInfo(psychologistId);

    const totalAppointmentsAndPatientByPsy = await getTotalAppointmentsAndPatientByPsy(req);

    return res.render('reimbursement', {
      pageTitle: 'Remboursement',
      universities: universityList,
      currentConvention,
      showForm: currentConvention.universityId === undefined,
      total: totalAppointmentsAndPatientByPsy,
    });
  } catch (err) {
    console.error('Could not fetch currentPsy or conventionInfo', err);
    req.flash('error', 'La page Remboursement n\'arrive pas à s\'afficher.');
    return res.redirect('/psychologue/mes-seances');
  }
};

module.exports.updateConventionInfoValidators = [
  // Note : no sanitizing because isUUID will not allow strange html anyway.
  check('university')
    .isUUID()
    .withMessage('Vous devez choisir une université.'),
  // Note : no sanitizing because only 2 possible values, so will not allow strange html anyway.
  check('signed')
    .isIn(['yes', 'no'])
    .withMessage('Vous devez spécifier si la convention est signée ou non.'),
];

module.exports.updateConventionInfo = async (req, res) => {
  if (!validation.checkErrors(req)) {
    return res.redirect('/psychologue/mes-remboursements');
  }

  const universityId = req.body.university;
  const isConventionSigned = req.body.signed === 'yes';

  try {
    const psychologistId = cookie.getCurrentPsyId(req);
    await dbPsychologists.updateConventionInfo(psychologistId, universityId, isConventionSigned);
    req.flash('info', 'Vos informations de conventionnement sont bien enregistrées.');
    return res.redirect('/psychologue/mes-remboursements');
  } catch (err) {
    console.error('Could not update paying university for psy.', err);
    req.flash('error', 'Erreur pendant l\'enregistrement. Vous pouvez réessayer.');
    return res.redirect('/psychologue/mes-remboursements');
  }
};
