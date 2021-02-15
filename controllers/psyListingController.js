const utils = require('../utils/demarchesSimplifiees');
const db = require('../utils/db')

module.exports.getPsychologist  = async function getPsychologist(req, res) {
  try {
    const  psyList = await db.getPsychologists()

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