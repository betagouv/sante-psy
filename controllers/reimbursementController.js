const { check } = require('express-validator');
const dbAppointments = require('../db/appointments');
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
  const psychologistId = req.user.psychologist;
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
    return res.json({
      success: false,
      message: 'La page Remboursement n\'arrive pas à s\'afficher.',
    });
  }

  try {
    const psychologistId = req.user.psychologist;
    const currentConvention = await dbPsychologists.getConventionInfo(psychologistId);

    const totalAppointmentsAndPatientByPsy = await getTotalAppointmentsAndPatientByPsy(req);

    return res.json({
      success: true,
      universities: universityList,
      currentConvention,
      total: totalAppointmentsAndPatientByPsy,
    });
  } catch (err) {
    console.error('Could not fetch currentPsy or conventionInfo', err);
    return res.json({
      success: false,
      message: 'La page Remboursement n\'arrive pas à s\'afficher.',
    });
  }
};

module.exports.updateConventionInfoValidators = [
  // Note : no sanitizing because isUUID will not allow strange html anyway.
  check('universityId')
    .isUUID()
    .withMessage('Vous devez choisir une université.'),
  // Note : no sanitizing because only 2 possible values, so will not allow strange html anyway.
  check('isConventionSigned')
    .isBoolean()
    .withMessage('Vous devez spécifier si la convention est signée ou non.'),
];

module.exports.updateConventionInfo = async (req, res) => {
  if (!validation.checkErrors(req)) {
    return res.json({ success: false, message: req.error });
  }

  const { universityId, isConventionSigned } = req.body;
  console.log(universityId, isConventionSigned);

  try {
    const psychologistId = req.user.psychologist;
    await dbPsychologists.updateConventionInfo(psychologistId, universityId, isConventionSigned);
    return res.json({
      success: true,
      message: 'Vos informations de conventionnement sont bien enregistrées.',
    });
  } catch (err) {
    console.error('Could not update paying university for psy.', err);
    return res.json({ success: false, message: 'Erreur pendant l\'enregistrement. Vous pouvez réessayer.' });
  }
};
