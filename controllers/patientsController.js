const { check, oneOf } = require('express-validator');
const dbPatients = require('../db/patients');
const validation = require('../utils/validation');
const date = require('../utils/date');

module.exports.getPatients = async (req, res) => {
  try {
    const psychologistId = req.user.psychologist;
    const patients = await dbPatients.getPatients(psychologistId);
    return res.json({ patients });
  } catch (err) {
    console.error('getPatients', err);
    return res.json({
      patients: [],
      success: false,
      message: 'Impossible de charger les patients. Réessayez ultérieurement.',
    });
  }
};

// Validators we reuse for editPatient and createPatient
const patientValidators = [
  // todo : do we html-escape here ? We already escape in templates.
  check('firstNames')
    .trim().not().isEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .withMessage('Vous devez spécifier le.s prénom.s du patient.'),
  check('lastName')
    .trim().not().isEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .withMessage('Vous devez spécifier le nom du patient.'),
  oneOf(
    [
      // Two valid possibilities : ine is empty, or ine is valid format.
      check('INE').trim().isEmpty(),
      check('INE')
        .trim().isAlphanumeric()
        .isLength({ min: 1, max: dbPatients.studentNumberSize })
        .customSanitizer((value, { req }) => req.sanitize(value)),
    ],
    `Le numéro INE doit faire maximum ${dbPatients.studentNumberSize} caractères alphanumériques \
(chiffres ou lettres sans accents).
    Si vous ne l'avez pas maintenant, ce n'est pas grave, vous pourrez y revenir plus tard.`,
  ),
  oneOf(
    [
      // Two valid possibilities : dateofbirth is empty, or dateofbirth is valid format.
      check('dateOfBirth').trim().isEmpty(),
      check('dateOfBirth')
        .trim().isDate({ format: date.formatFrenchDateForm })
        .customSanitizer((value, { req }) => req.sanitize(value)),
    ],
    `La date de naissance n'est pas valide, le format doit être JJ/MM/AAAA.
    Si vous ne l'avez pas maintenant, ce n'est pas grave, vous pourrez y revenir plus tard.`,
  ),
  check('institutionName')
    .trim()
    .customSanitizer((value, { req }) => req.sanitize(value)),
  check('doctorAddress')
    .trim()
    .customSanitizer((value, { req }) => req.sanitize(value)),
  check('doctorName')
    .trim()
    .customSanitizer((value, { req }) => req.sanitize(value)),
];

module.exports.editPatientValidators = [
  // todo : do we html-escape here ? We already escape in templates.
  check('patientId')
    .trim().not().isEmpty()
    .isUUID()
    .withMessage('Ce patient n\'existe pas.'),
  ...patientValidators,
];

module.exports.editPatient = async (req, res) => {
  if (!validation.checkErrors(req)) {
    return res.json({ success: false, message: req.error });
  }

  const { patientId } = req.params;
  const patientFirstNames = req.body.firstNames;
  const patientLastName = req.body.lastName;
  const dateOfBirth = date.parseDateForm(req.body.dateOfBirth);
  const patientINE = req.body.INE;
  const patientInstitutionName = req.body.institutionName;
  const { doctorName } = req.body;
  const { doctorAddress } = req.body;
  // Force to boolean beacause checkbox value send undefined when it's not checked
  const patientIsStudentStatusVerified = Boolean(req.body.isStudentStatusVerified);
  const patientHasPrescription = Boolean(req.body.hasPrescription);

  try {
    const psychologistId = req.user.psychologist;
    const updated = await dbPatients.updatePatient(
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
      dateOfBirth,
    );

    if (updated === 0) {
      console.log(`Patient ${patientId} not updated by probably other psy id ${psychologistId}`);
      return res.json({ success: false, message: 'Ce patient n\'existe pas.' });
    }

    let infoMessage = `Le patient ${patientFirstNames} ${patientLastName} a bien été modifié.`;
    if (!patientINE || !patientInstitutionName || !patientHasPrescription || !patientIsStudentStatusVerified
      || !doctorAddress) {
      infoMessage += ' Vous pourrez renseigner les champs manquants plus tard'
        + ' en cliquant le bouton "Modifier" du patient.';
    }
    console.log(`Patient ${patientId} updated by psy id ${psychologistId}`);
    return res.json({ success: true, message: infoMessage });
  } catch (err) {
    console.error('Erreur pour modifier le patient', err);
    return res.json({ success: false, message: 'Erreur. Le patient n\'est pas modifié. Pourriez-vous réessayer ?' });
  }
};

module.exports.getPatientValidators = [
  check('patientId')
    .trim().not().isEmpty()
    .isUUID()
    .withMessage('Ce patient n\'existe pas.'),
];

module.exports.getPatient = async (req, res) => {
  if (!validation.checkErrors(req)) {
    return res.json({ success: false, message: req.error });
  }

  const { patientId } = req.params;
  try {
    const psychologistId = req.user.psychologist;
    const patient = await dbPatients.getPatientById(patientId, psychologistId);

    if (!patient) {
      return res.json({ success: false, message: 'Ce patient n\'existe pas. Vous ne pouvez pas le modifier.' });
    }
    console.debug(`Rendering getEditPatient for ${patientId}`);
    return res.json({
      success: true,
      patient,
    });
  } catch (err) {
    console.error('Error getPatient', err);
    return res.json({ success: false, message: 'Erreur lors de la recuperation du patient.' });
  }
};

module.exports.createNewPatientValidators = patientValidators;

module.exports.createNewPatient = async (req, res) => {
  if (!validation.checkErrors(req)) {
    return res.json({ success: false, message: req.error });
  }
  const { firstNames } = req.body;
  const { lastName } = req.body;
  const dateOfBirth = date.parseDateForm(req.body.dateOfBirth);
  const { INE } = req.body;
  const { institutionName } = req.body;
  const { doctorName } = req.body;
  const { doctorAddress } = req.body;
  // Force to boolean beacause checkbox value send undefined when it's not checked
  const isStudentStatusVerified = Boolean(req.body.isStudentStatusVerified);
  const hasPrescription = Boolean(req.body.hasPrescription);

  try {
    const psychologistId = req.user.psychologist;
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
      dateOfBirth,
    );
    let infoMessage = `Le patient ${firstNames} ${lastName} a bien été créé.`;
    if (!INE || !institutionName || !hasPrescription || !isStudentStatusVerified || !doctorAddress || !dateOfBirth) {
      infoMessage += ' Vous pourrez renseigner les champs manquants plus tard'
        + ' en cliquant le bouton "Modifier" du patient.';
    }
    console.log(`Patient created by psy id ${psychologistId}`);
    return res.json({
      success: true,
      message: infoMessage,
    });
  } catch (err) {
    console.error('Erreur pour créer le patient', err);
    return res.json({
      success: false,
      message: "Erreur. Le patient n'a pas été créé. Pourriez-vous réessayer ?",
    });
  }
};

module.exports.deletePatientValidators = [
  check('patientId')
    .isUUID()
    .withMessage('Vous devez spécifier un patient à supprimer.'),
];

module.exports.deletePatient = async (req, res) => {
  if (!validation.checkErrors(req)) {
    return res.json({ success: false, message: req.error });
  }

  try {
    const { patientId } = req.params;
    const psychologistId = req.user.psychologist;
    const deleted = await dbPatients.deletePatient(patientId, psychologistId);

    if (deleted === 0) {
      console.log(`Patient ${patientId} not deleted by probably other psy id ${psychologistId}`);
      return res.json({ success: false, message: 'Vous devez spécifier un patient à supprimer.' });
    }

    console.log(`Patient deleted ${patientId} by psy id ${psychologistId}`);
    return res.json({
      success: true,
      message: 'Le patient a bien été supprimé.',
    });
  } catch (err) {
    console.error('Erreur pour supprimer le patient', err);
    return res.json({
      success: false,
      message: "Erreur. Le patient n'est pas supprimé. Pourriez-vous réessayer ?",
    });
  }
};
