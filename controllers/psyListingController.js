const utils = require('../utils/demarchesSimplifiees');

module.exports.getPsychologist  = async function getPsychologist(req, res) {
  try {
    const psyList = await utils.getPsychologistList().psychologists;

    res.render('psyListing', {
      psyList,
      errors: req.flash('error')
    });
  } catch (err) {
    console.error('getPsychologist', err);
    res.render('psyListing', {
      psyList: [],
      errors: [err],
    });
  }
};