const utils = require('../utils/demarchesSimplifiees');

module.exports.getPsychologist  = async function getPsychologist(req, res) {
  try {
    const psyList = await utils.getPsychologistList();

    res.render('psyListing', {
      psyList,
    });
  } catch (err) {
    console.error('getPsychologist', err);
    res.render('psyListing', {
      psyList: [],
      errors: [err],
    });
  }
};