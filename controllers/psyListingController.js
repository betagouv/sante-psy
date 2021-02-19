const utils = require('../utils/demarchesSimplifiees');

module.exports.getPsychologist  = async function getPsychologist(req, res) {
  try {
    const psyList = await utils.getPsychologistList();

    res.render('psyListing', {
      psyList,
      errors: req.flash('error')
    });
  } catch (err) {
    req.flash('error', 'Impossible de récupérer les psychologues. Réessayez ultérieurement.')
    console.error('getPsychologist', err);
    res.render('psyListing', {
      psyList: [],
    });
  }
};
