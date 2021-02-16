const utils = require('../utils/demarchesSimplifiees');
const db = require('../utils/db')

module.exports.getPsychologist  = async function getPsychologist(req, res) {
  try {
    const time = `getting all psychologists from Postgres (query id #${Math.random().toString()})`;
    console.time(time);
    const  psyList = await db.getPsychologists()
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