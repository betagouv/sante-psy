const { check, oneOf } = require('express-validator');
const validation = require('../utils/validation');
const dbPsychologists = require('../db/psychologists');

module.exports.getPsyProfile = async (req, res) => {
  try {
    const { psyId } = req.params;
    const psychologist = await dbPsychologists.getPsychologistById(psyId);
    if (!psychologist) {
      throw Error("Le psychologue n'existe pas.");
    }

    return res.json({
      success: true,
      psychologist: {
        email: psychologist.email,
        address: psychologist.address,
        departement: psychologist.departement,
        region: psychologist.region,
        phone: psychologist.phone,
        website: psychologist.website,
        teleconsultation: psychologist.teleconsultation,
        description: psychologist.description,
        languages: psychologist.languages,
        personalEmail: psychologist.personalEmail,
      },
    });
  } catch (err) {
    console.error('Error getPsyProfile', err);
    return res.json({ success: false, message: 'Erreur lors de la récupération du profil.' });
  }
};

module.exports.editPsyProfilValidators = [
  check('personalEmail')
    .trim()
    .notEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .isEmail()
    .withMessage('Vous devez spécifier un email valide.'),
  check('address')
    .trim()
    .notEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .withMessage("Vous devez spécifier l'adresse de votre cabinet."),
  check('departement')
    .trim()
    .notEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .withMessage('Vous devez spécifier votre département.'),
  check('region')
    .trim()
    .notEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .withMessage('Vous devez spécifier votre région.'),
  check('phone')
    .trim()
    .notEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .withMessage('Vous devez spécifier le téléphone du secrétariat.'),
  check('languages')
    .trim()
    .notEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .withMessage('Vous devez spécifier les langues parlées.'),
  oneOf(
    [
      // Two valid possibilities : email is empty, or email is valid format.
      check('email').trim().isEmpty(),
      check('email')
          .trim()
          .customSanitizer((value, { req }) => req.sanitize(value))
          .isEmail(),
    ], 'Vous devez spécifier un email valide.',
  ),
  check('description')
    .trim()
    .customSanitizer((value, { req }) => req.sanitize(value)),
  oneOf(
    [
      // Two valid possibilities : website is empty, or website is valid format.
      check('website').trim().isEmpty(),
      check('website')
            .trim()
            .customSanitizer((value, { req }) => req.sanitize(value))
            .isURL(),
    ], 'Vous devez spécifier une URL valide.',
  ),
  check('teleconsultation')
    .isBoolean()
    .withMessage('Vous devez spécifier si vous proposez la téléconsultation.'),
];

module.exports.editPsyProfile = async (req, res) => {
  if (!validation.checkErrors(req)) {
    return res.json({ success: false, message: req.error });
  }

  try {
    const { psyId } = req.params;

    await dbPsychologists.updatePsychologist({
      dossierNumber: psyId,
      ...req.body,
    });

    return res.json({
      success: true,
      message: 'Vos informations ont bien été mises à jour.',
    });
  } catch (err) {
    console.error('Erreur pour modifier le profil psy', err);
    return res.json({
      success: false,
      message: 'Erreur. Les informations n\'ont pas été mises à jour. Pourriez-vous réessayer ?',
    });
  }
};
