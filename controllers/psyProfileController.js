const dbPsychologists = require('../db/psychologists');

module.exports.getPsyProfile = async (req, res) => {
  try {
    const { psyId } = req.params;

    if (req.user.psychologist !== psyId) {
      throw Error('Le token ne correspond pas à la requête');
    }

    const psychologist = await dbPsychologists.getPsychologistById(psyId);
    if (!psychologist) {
      throw Error("Le psychologue n'existe pas");
    }

    if (psychologist.state !== 'accepte') {
      return res.json({
        success: false,
        message: "Votre dossier n'est pas accepté, vous ne pouvez pas visualiser ces informations.",
      });
    }

    // TODO: refactor
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
