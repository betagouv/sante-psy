const cookie = require('../utils/cookie')
const { check, query, oneOf } = require('express-validator');
const dbPatient = require('../db/patients')
const dbDoctors = require('../db/doctors')
const validation = require('../utils/validation')

module.exports.newPatient = async (req, res) => {
  const doctors = await dbDoctors.getDoctors();

  res.render('editPatient', {
    pageTitle: 'Nouveau patient',
    pageIntroText: `Déclarez un étudiant comme étant patient du dispositif Santé Psy Etudiants.
      Vous pourrez ensuite déclarer les séances réalisées avec ce patient.`,
    form: {
      method: 'POST',
      action: '/psychologue/api/creer-nouveau-patient',
      submitButtonText: 'Ajouter le patient',
      submitButtonIcon: 'rf-fi-add-line',
    },
    patient: {
      firstNames: '',
      lastName: '',
      INE: '',
      id: '',
    },
    doctors : doctors
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
  check('doctorid')
    .trim().not().isEmpty()
    .customSanitizer((value, { req }) => {
      return req.sanitize(value)
    })
    .withMessage('Vous devez spécifier le médecin.'),
  oneOf(
    [
      // Two valid possibilities : ine is empty, or ine is valid format.
      check('ine').trim().isEmpty(),
      check('ine')
        .trim().isAlphanumeric()
        .isLength({min:11, max:11})
        .customSanitizer((value, { req }) => {
          return req.sanitize(value)
        })
    ],
    `Le numéro INE doit faire 11 caractères (chiffres ou lettres).
    Si vous ne l'avez pas maintenant, ce n'est pas grave, vous pourrez y revenir plus tard.`)
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
  const doctorId = req.body['doctorid']

  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    const existDoctor = await dbDoctors.checkDoctorIdExist(doctorId)
    if( existDoctor ) {
      await dbPatient.updatePatient(patientId, patientFirstNames, patientLastName, patientINE, psychologistId, doctorId)
      req.flash('info', `Le patient a bien été modifié.`)
    } else {
      req.flash('error', "Erreur. Le medecin n'est pas connu de nos services.")
      return res.redirect('/psychologue/modifier-patient')
    }
    return res.redirect('/psychologue/mes-seances')
  } catch (err) {
    req.flash('error', 'Erreur. Le patient n\'est pas modifié. Pourriez-vous réessayer ?')
    console.error('Erreur pour modifier le patient', err)
    return res.redirect('/psychologue/modifier-patient')
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
    const patient = await dbPatient.getPatientById(patientId, psychologistId)
    const doctors = await dbDoctors.getDoctors();
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
        submitButtonIcon: 'rf-fi-check-line',
      },
      patient: patient,
      doctors : doctors
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
  const doctorId = req.body['doctorid']
  const INE = req.body['ine']

  try {
    console.log(`creating a new patient (${INE}) with doctor id ${doctorId}`)
    const psychologistId = cookie.getCurrentPsyId(req)
    const existDoctor = await dbDoctors.checkDoctorIdExist(doctorId)
    if( existDoctor ) {
      await dbPatient.insertPatient(firstNames, lastName, INE, psychologistId, doctorId)
      let infoMessage = `Le patient ${firstNames} ${lastName} a bien été créé.`
      if (!INE || INE.length === 0) {
        infoMessage += ' Vous pourrez renseigner son numero INE plus tard.'
      }
      req.flash('info', infoMessage)
    } else {
      req.flash('error', "Erreur. Le medecin n'est pas connu de nos services.")
    }
    return res.redirect('/psychologue/mes-seances')
  } catch (err) {
    req.flash('error', 'Erreur. Le patient n\'a pas été créé. Pourriez-vous réessayer ?')
    console.error('Erreur pour créer le patient', err)
    return res.redirect('/psychologue/nouveau-patient')
  }
}


