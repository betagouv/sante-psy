const dbPsychologists = require('../db/psychologists');

module.exports.getPsychologists = async function getPsychologists(req, res) {
  try {
    const time = `getting all psychologists from Postgres (query id #${Math.random().toString()})`;
    console.time(time);
    const psyList = await dbPsychologists.getPsychologists();
    console.timeEnd(time);

    res.json({
      psyList,
    });
  } catch (err) {
    console.error('getPsychologist', err);
    res.json('psyListing', {
      psyList: [],
      message: 'Impossible de récupérer les psychologues. Réessayez ultérieurement.',
    });
  }
};

module.exports.getPsychologist = async function getPsychologist(req, res) {
  try {
    const psy = await dbPsychologists.getAcceptedPsychologistByEmail(req.params.email);
    res.json({
      psy,
    });
  } catch (err) {
    res.status(500).send('Ooops');
  }
};
