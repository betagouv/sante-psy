const dbAppointments = require('../db/appointments')
const { check } = require('express-validator');
const cookie = require('../utils/cookie')
const dbPsychologists = require('../db/psychologists')
const dbUniversities = require('../db/universities')
const validation = require('../utils/validation')
const _ = require('lodash')

module.exports.reimbursement = async function reimbursement(req, res) {
  let universityList = []
  try {
    universityList = await dbUniversities.getUniversities()
    if (!universityList || universityList.length === 0) {
      throw new Error('No universities in db')
    }
    universityList.sort((a, b) => {
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    })
  } catch (err) {
    console.error(`Could not fetch universities`, err)
    req.flash('error', `La page Remboursement n'arrive pas à s'afficher.`)
    return res.redirect('/psychologue/mes-seances')
  }

  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    const conventionInfo = await dbPsychologists.getConventionInfo(psychologistId)
    const currentConvention = conventionInfo === undefined ?
      {universityId: undefined, universityName: undefined, isConventionSigned: false} :
      conventionInfo
    res.render('reimbursement', {
      pageTitle: 'Remboursement',
      universities: universityList,
      currentConvention: currentConvention,
      showForm: conventionInfo === undefined,
    });
  } catch (err) {
    console.error(`Could not fetch currentPsy or conventionInfo`, err)
    req.flash('error', `La page Remboursement n'arrive pas à s'afficher.`)
    return res.redirect('/psychologue/mes-seances')
  }
}

function sameYearMonth(arrayVal, othVal) {
  if(arrayVal.month === othVal.month && arrayVal.year === othVal.year) {
    return {
      month: arrayVal.month,
      year: arrayVal.year,
      countPatients: arrayVal.countPatients,
      countAppointments: othVal.countAppointments,
    }
  }
}
module.exports.billing = async function billing(req, res) {
  try {
    const psychologistId = req.sanitize(cookie.getCurrentPsyId(req))
    const totalAppointments = await dbAppointments.getCountAppointmentsByYearMonth(psychologistId);
    const totalPatients = await dbAppointments.getCountPatientsByYearMonth(psychologistId);

    const total = _.unionWith(totalPatients, totalAppointments, sameYearMonth);
    console.log("total", total);
    //@TODO merge totalAppointments and totalPatients

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

module.exports.updateConventionInfoValidators = [
  // Note : no sanitizing because isUUID will not allow strange html anyway.
  check('university')
    .isUUID()
    .withMessage('Vous devez choisir une université.'),
  // Note : no sanitizing because only 2 possible values, so will not allow strange html anyway.
  check('signed')
    .isIn(['yes', 'no'])
    .withMessage('Vous devez spécifier si la convention est signée ou non.'),
]

module.exports.updateConventionInfo = async (req, res) => {
  if (!validation.checkErrors(req)) {
    return res.redirect('/psychologue/mes-remboursements')
  }

  const universityId = req.body['university']
  const isConventionSigned = req.body.signed === 'yes'

  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    await dbPsychologists.updateConventionInfo(psychologistId, universityId, isConventionSigned)

    req.flash('info', `Vos informations de conventionnement sont bien enregistrées.`)
    return res.redirect('/psychologue/mes-remboursements')
  } catch (err) {
    console.error(`Could not update paying university for psy.`, err)
    req.flash('error', `Erreur pendant l'enregistrement. Vous pouvez réessayer.`)
    return res.redirect('/psychologue/mes-remboursements')
  }
}
