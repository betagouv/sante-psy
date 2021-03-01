const cookie = require('../utils/cookie')
const { check } = require('express-validator');
const dbPatient = require('../db/patients')
const validation = require('../utils/validation')

module.exports.newPatient = async (req, res) => {
  res.render('newPatient', { pageTitle: 'Nouveau patient' })
}

module.exports.createNewPatientValidators = [
  // todo : do we html-escape here ? We already escape in templates.
  check('firstnames')
    .trim().not().isEmpty()
    .withMessage('Vous devez spécifier le.s prénom.s du patient.'),
  check('lastname')
    .trim().not().isEmpty()
    .withMessage('Vous devez spécifier le nom du patient.'),
  // todo validate INE : can be either empty, or 11 alpahnumeric chars
]

module.exports.createNewPatient = async (req, res) => {
  // todo protection against injections
  if (!validation.checkErrors(req)) {
    return res.redirect('/nouveau-patient')
  }

  const firstNames = req.body['firstnames']
  const lastName = req.body['lastname']
  // Todo test empty studentNumber
  const INE = req.body['ine']

  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    await dbPatient.insertPatient(firstNames, lastName, INE, psychologistId)
    req.flash('info', `Le patient ${firstNames} ${lastName} a bien été créé.`)
    return res.redirect('/mes-seances')
  } catch (err) {
    req.flash('error', 'Erreur. Le patient n\'a pas été créé. Pourriez-vous réessayer ?')
    console.error('Erreur pour créer le patient', err)
    return res.redirect('/nouveau-patient')
  }
}
