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

    // TODO: refactor (select on db ?)
    const {
      dossierNumber, adeli, archived, createdAt, updatedAt,
      assignedUniversityId, declaredUniversityId, university,
      isConventionSigned, state,
      ...returnedFields
    } = psychologist;
    return res.json({ success: true, psychologist: returnedFields });
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
    .withMessage('Vous devez spécifier votre email personnel.'),
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
  check('email')
    .trim()
    .customSanitizer((value, { req }) => req.sanitize(value)),
  check('description')
    .trim()
    .customSanitizer((value, { req }) => req.sanitize(value)),
  check('website')
    .trim()
    .customSanitizer((value, { req }) => req.sanitize(value)),
];

module.exports.editPsyProfile = async (req, res) => {
  if (!validation.checkErrors(req)) {
    return res.json({ success: false, message: req.error });
  }

  try {
    const { psyId } = req.params;
    const {
      email,
      address,
      departement,
      region,
      phone,
      website,
      description,
      languages,
      personalEmail,
    } = req.body;
    // Force to boolean beacause checkbox value send undefined when it's not checked
    const teleconsultation = Boolean(req.body.teleconsultation);

    const nbUpdated = await dbPsychologists.updatePsychologist(
      psyId,
      email,
      address,
      departement,
      region,
      phone,
      website,
      description,
      teleconsultation,
      languages,
      personalEmail,
    );

    if (nbUpdated === 0) {
      throw Error('La requête de mise à jour n\'a modifié aucune ligne.');
    }

    return res.json({
      success: true,
      message: 'Les informations ont bien été mises à jour.',
    });
  } catch (err) {
    console.error('Erreur pour modifier le profil psy', err);
    return res.json({
      success: false,
      message: 'Erreur. Les informations n\'ont pas été mises à jour. Pourriez-vous réessayer ?',
    });
  }
};
