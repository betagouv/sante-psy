const cookie = require('../utils/cookie')
const { check, query, oneOf } = require('express-validator');
const dbPatients = require('../db/patients')
const validation = require('../utils/validation')

module.exports.newPatient = async (req, res) => {
  res.render('editPatient', {
    pageTitle: 'Nouveau patient',
    pageIntroText: `Déclarez un étudiant comme étant patient du dispositif Santé Psy Etudiants.
      Vous pourrez ensuite déclarer les séances réalisées avec ce patient.`,
    form: {
      method: 'POST',
      action: '/psychologue/api/creer-nouveau-patient',
      submitButtonText: 'Ajouter le patient',
      submitButtonIcon: 'fr-fi-add-line',
    },
    patient: {
      firstNames: '',
      lastName: '',
      INE: '',
      institutionName: '',
      isStudentStatusVerified: false,
      hasPrescription: false,
      id: '',
      doctorName: '',
      doctorAddress: '',
    }
  })
}

// Validators we reuse for editPatient and createPatient
const patientValidators = [
  // todo : do we html-escape here ? We already escape in templates.
  check('firstnames')
    .trim().not().isEmpty()
    .customSanitizer((value, { req }) => {
      return req.sanitize(value)
    })
    .withMessage('Vous devez spécifier le.s prénom.s du patient.'),
  check('lastname')
    .trim().not().isEmpty()
    .customSanitizer((value, { req }) => {
      return req.sanitize(value)
    })
    .withMessage('Vous devez spécifier le nom du patient.'),
  oneOf(
    [
      // Two valid possibilities : ine is empty, or ine is valid format.
      check('ine').trim().isEmpty(),
      check('ine')
        .trim().isAlphanumeric()
        .isLength({min:1, max: dbPatients.studentNumberSize})
        .customSanitizer((value, { req }) => {
          return req.sanitize(value)
        })
    ],
    `Le numéro INE doit faire maximum ${dbPatients.studentNumberSize} caractères alphanumériques \
(chiffres ou lettres sans accents).
    Si vous ne l'avez pas maintenant, ce n'est pas grave, vous pourrez y revenir plus tard.`
  ),
  check('institution')
    .trim()
    .customSanitizer((value, { req }) => {
      return req.sanitize(value)
    }),
  check('doctoraddress')
    .trim()
    .customSanitizer((value, { req }) => {
      return req.sanitize(value)
    }),
  check('doctorname')
    .trim()
    .customSanitizer((value, { req }) => {
      return req.sanitize(value)
    }),
]

module.exports.editPatientValidators = [
  // todo : do we html-escape here ? We already escape in templates.
  check('patientid')
    .trim().not().isEmpty()
    .isUUID()
    .withMessage(`Ce patient n'existe pas.`),
  ...patientValidators
]

module.exports.editPatient = async (req, res) => {
  if (!validation.checkErrors(req)) {
    const hasPatientIdError = validation.hasErrorsForField(req, 'patientid')
    if (hasPatientIdError) {
      // Do not use the value of patientid in url ! It is not safe since it did not pass validation.
      return res.redirect('/psychologue/mes-seances')
    }
    return res.redirect('/psychologue/modifier-patient?patientid=' + req.body['patientid'])
  }

  const patientId = req.body['patientid']
  const patientFirstNames = req.body['firstnames']
  const patientLastName = req.body['lastname']
  const patientINE = req.body['ine']
  const patientInstitutionName = req.body['institution']
  const doctorName = req.body['doctorname']
  const doctorAddress = req.body['doctoraddress']
  // Force to boolean beacause checkbox value send undefined when it's not checked
  const patientIsStudentStatusVerified = Boolean(req.body['isstudentstatusverified'])
  const patientHasPrescription = Boolean(req.body['hasprescription'])

  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    await dbPatients.updatePatient(
      patientId,
      patientFirstNames,
      patientLastName,
      patientINE,
      patientInstitutionName,
      patientIsStudentStatusVerified,
      patientHasPrescription,
      psychologistId,
      doctorName,
      doctorAddress,
    )
    let infoMessage = `Le patient ${patientFirstNames} ${patientLastName} a bien été modifié.`
    if (!patientINE || !patientInstitutionName || !patientHasPrescription || !patientIsStudentStatusVerified ||
      !doctorAddress) {
      infoMessage += ' Vous pourrez renseigner les champs manquants plus tard' +
        ' en cliquant le bouton "Modifier" du patient.'
    }
    console.log(`Patient ${patientId} updated by psy id ${psychologistId}`)
    req.flash('info', infoMessage)
    return res.redirect('/psychologue/mes-seances')
  } catch (err) {
    req.flash('error', 'Erreur. Le patient n\'est pas modifié. Pourriez-vous réessayer ?')
    console.error('Erreur pour modifier le patient', err)
    return res.redirect('/psychologue/mes-seances')
  }
}

module.exports.getEditPatientValidators = [
  query('patientid')
    .trim().not().isEmpty()
    .isUUID()
    .withMessage(`Ce patient n'existe pas.`),
]

module.exports.getEditPatient = async (req, res) => {
  if (!validation.checkErrors(req)) {
    return res.redirect('/psychologue/mes-seances')
  }

  // Get patientId from query params, this is a GET request
  const patientId = req.query['patientid']

  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    const patient = await dbPatients.getPatientById(patientId, psychologistId)
    if (!patient) {
      req.flash('error', 'Ce patient n\'existe pas. Vous ne pouvez pas le modifier.')
      return res.redirect('/psychologue/mes-seances')
    }
    console.debug(`Rendering getEditPatient for ${patientId}`)
    res.render('editPatient', {
      pageTitle: 'Modifier un patient',
      pageIntroText: `Modifiez les informations de l'étudiant.`,
      form: {
        method: 'POST',
        action: '/psychologue/api/modifier-patient',
        submitButtonText: 'Valider les modifications',
        submitButtonIcon: 'fr-fi-check-line',
      },
      patient: patient
    })
  } catch (err) {
    req.flash('error', 'Erreur lors de la sauvegarde.')
    console.error('Error getEditPatient', err)
    return res.redirect('/psychologue/mes-seances')
  }
}

module.exports.createNewPatientValidators = patientValidators

module.exports.createNewPatient = async (req, res) => {
  if (!validation.checkErrors(req)) {
    return res.redirect('/psychologue/nouveau-patient')
  }
  const firstNames = req.body['firstnames']
  const lastName = req.body['lastname']
  const INE = req.body['ine']
  const institutionName = req.body['institution']
  const doctorName = req.body['doctorname']
  const doctorAddress = req.body['doctoraddress']
  // Force to boolean beacause checkbox value send undefined when it's not checked
  const isStudentStatusVerified = Boolean(req.body['isstudentstatusverified'])
  const hasPrescription = Boolean(req.body['hasprescription'])

  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    await dbPatients.insertPatient(
      firstNames,
      lastName,
      INE,
      institutionName,
      isStudentStatusVerified,
      hasPrescription,
      psychologistId,
      doctorName,
      doctorAddress,
    )
    let infoMessage = `Le patient ${firstNames} ${lastName} a bien été créé.`
    if (!INE || !institutionName || !hasPrescription || !isStudentStatusVerified || !doctorAddress ) {
      infoMessage += ' Vous pourrez renseigner les champs manquants plus tard' +
        ' en cliquant le bouton "Modifier" du patient.'
    }
    console.log(`Patient created by psy id ${psychologistId}`)
    req.flash('info', infoMessage)
    return res.redirect('/psychologue/mes-seances')
  } catch (err) {
    req.flash('error', 'Erreur. Le patient n\'a pas été créé. Pourriez-vous réessayer ?')
    console.error('Erreur pour créer le patient', err)
    return res.redirect('/psychologue/nouveau-patient')
  }
}


