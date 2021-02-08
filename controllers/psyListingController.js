const utils = require('../utils/demarchesSimplifiees');

module.exports.getPsychologist  = async function getPsychologist(req, res) {
  try {
    console.log(`req received : ${req}`);


    //@TODO query demarches simplifiées API
    const psyList = await utils.getPsychologistList();
    console.log("psyList", psyList);
    res.render('psyListing', {
      psyList,
      error: req.flash('error')
    });
  } catch (err) {
    console.error('getPsychologist', err);
    res.render('psyListing', {
      psyList: [],
      error: err,
    });
  }
};