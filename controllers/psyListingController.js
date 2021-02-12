const utils = require('../utils/demarchesSimplifiees');

module.exports.getPsychologist  = async function getPsychologist(req, res) {
  try {
    const time = "displaying all psychologists from DS (query id : " + Math.random().toString(); + ")";
    console.time(time);
    const psyList = await utils.getPsychologistList();
    console.timeEnd(time);

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