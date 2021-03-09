const cookie = require('../utils/cookie')
const { check, query, oneOf } = require('express-validator');
const dbDoctors = require('../db/doctors')
const validation = require('../utils/validation')

module.exports.newDoctor = async (req, res) => {
  const firstNames = req.body['firstnames'] || ''
  const lastName = req.body['lastname'] || ''
  const address = req.body['address'] || ''
  const city = req.body['city'] || ''
  const postalCode = req.body['postalcode'] || ''
  const phone = req.body['phone'] || ''

  res.render('editDoctor', {
    pageTitle: 'Nouveau medecin',
    pageIntroText: `Déclarez un médecin du dispositif Santé Psy Etudiants.
      Vous pourrez ensuite déclarer les séances d'un patient réalisées à partir d'une orientation de ce médecin.`,
    form: {
      method: 'POST',
      action: '/psychologue/api/creer-nouveau-medecin',
      submitButtonText: 'Ajouter le medecin',
      submitButtonIcon: 'rf-fi-add-line',
    },
    doctor: {
      firstNames: firstNames,
      lastName: lastName,
      city: city,
      postalCode: postalCode,
      address: address,
      phone: phone,
    }
  })
}

// Validators we reuse for editDoctor and createDoctor
const doctorValidators = [
  // todo : do we html-escape here ? We already escape in templates.
  check('firstnames')
    .trim().not().isEmpty()
    .customSanitizer((value, { req }) => {
      return req.sanitize(value)
    })
    .withMessage('Vous devez spécifier le.s prénom.s du médecin.'),
  check('lastname')
    .trim().not().isEmpty()
    .customSanitizer((value, { req }) => {
      return req.sanitize(value)
    })
    .withMessage('Vous devez spécifier le nom du médecin.'),
  check('city')
    .trim().not().isEmpty()
    .customSanitizer((value, { req }) => {
      return req.sanitize(value)
    })
    .withMessage('Vous devez spécifier la ville du médecin.'),
  check('postalcode')
    .trim().not().isEmpty(),
  check('postalcode')
        .trim().isAlphanumeric()
        .isLength({min:5, max:5})
    .customSanitizer((value, { req }) => {
      return req.sanitize(value)
    })
    .withMessage('Vous devez spécifier le code postal du médecin. Il devrait être composé de 5 chiffres.'),
]

module.exports.editDoctorValidators = [
  // todo : do we html-escape here ? We already escape in templates.
  check('doctorid')
    .trim().not().isEmpty()
    .isUUID()
    .withMessage(`Ce médecin n'existe pas.`),
  ...doctorValidators
]

module.exports.editDoctor = async (req, res) => {
  if (!validation.checkErrors(req)) {
    const hasDoctorsIdError = validation.hasErrorsForField(req, 'doctorid')
    if (hasDoctorsIdError) {
      // Do not use the value of doctorid in url ! It is not safe since it did not pass validation.
      return res.redirect('/psychologue/mes-seances')
    }
    return res.redirect('/psychologue/modifier-medecin?doctorid=' + req.body['doctorid'])
  }

  const doctorId = req.body['doctorid']
  const doctorFirstNames = req.body['firstnames']
  const doctorLastName = req.body['lastname']
  const doctorAddress = req.body['address']
  const doctorCity = req.body['city']
  const doctorPostalCode = req.body['postalcode']
  const doctorPhone = req.body['phone']

  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    if( dbDoctors.checkDoctorIdExist(doctorId, psychologistId) ) {
      await dbDoctors.updateDoctor(doctorId,
        psychologistId,
        doctorFirstNames,
        doctorLastName,
        doctorAddress,
        doctorCity,
        doctorPostalCode,
        doctorPhone)

      req.flash('info', `Le médecin a bien été modifié.`)
      return res.redirect('/psychologue/mes-seances')
    } else {
      console.debug(`not updating doctor id ${doctorId} because not owned by ${psychologistId}`)
      req.flash('error', "Erreur. Le medecin n'est pas connu de nos services.")
      return res.redirect('/psychologue/modifier-medecin')
    }
  } catch (err) {
    req.flash('error', 'Erreur. Le médecin n\'est pas modifié. Pourriez-vous réessayer ?')
    console.error('Erreur pour modifier le medecin', err)
    return res.redirect('/psychologue/modifier-medecin')
  }
}

module.exports.getEditDoctorValidators = [
  query('doctorid')
    .trim().not().isEmpty()
    .isUUID()
    .withMessage(`Ce médecin n'existe pas.`),
]

module.exports.getEditDoctor = async (req, res) => {
  if (!validation.checkErrors(req)) {
    return res.redirect('/psychologue/mes-seances')
  }

  // Get doctorId from query params, this is a GET request
  const doctorId = req.query['doctorid']

  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    const doctor = await dbDoctors.getDoctorById(doctorId, psychologistId)
    if (!doctor) {
      req.flash('error', 'Ce médecin n\'existe pas. Vous ne pouvez pas le modifier.')
      return res.redirect('/psychologue/mes-seances')
    }
    console.debug(`Rendering geteditDoctor for ${doctorId}`)
    res.render('editDoctor', {
      pageTitle: 'Modifier un médecin',
      pageIntroText: `Modifiez les informations du médecin`,
      form: {
        method: 'POST',
        action: '/psychologue/api/modifier-medecin',
        submitButtonText: 'Valider les modifications',
        submitButtonIcon: 'rf-fi-check-line',
      },
      doctor: doctor
    })
  } catch (err) {
    req.flash('error', 'Erreur lors de la sauvegarde.')
    console.error('Error geteditDoctor', err)
    return res.redirect('/psychologue/mes-seances')
  }
}

module.exports.createNewDoctorValidators = doctorValidators

module.exports.createNewDoctor = async (req, res) => {
  if (!validation.checkErrors(req)) {
    return res.redirect('/psychologue/nouveau-medecin')
  }

  const firstNames = req.body['firstnames']
  const lastName = req.body['lastname']
  const address = req.body['address']
  const city = req.body['city']
  const postalCode = req.body['postalcode']
  const phone = req.body['phone']

  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    console.debug(`Creating a new doctor for psy ${psychologistId}`);

    await dbDoctors.insertDoctor(psychologistId, firstNames, lastName, address, city, postalCode, phone)
    let infoMessage = `Le médecin ${firstNames} ${lastName} a bien été créé.`
    req.flash('info', infoMessage)
    return res.redirect('/psychologue/mes-seances')
  } catch (err) {
    req.flash('error', 'Erreur. Le médecin n\'a pas été créé. Pourriez-vous réessayer ?')
    console.error('Erreur pour créer le medecin', err)
    return res.redirect('/psychologue/nouveau-medecin')
  }
}


