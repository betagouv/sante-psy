const utils = require('../utils/demarchesSimplifiees');

module.exports.getPsychologist  = async function (req, res) {
  try {
    console.log(`req received : ${req}`);

    //@TODO query demarches simplifiées API
    const psyList = ['test']; //await utils.getPsychologistList(req.address, true);
    console.log(`TEST: ${psyList}`);
    const title = 'La liste des psychologues qui sont là pour vous aider';
    res.render('psyListing', {
      title,
      address: req.user.id,
      psyList: psyList,
      errors: req.flash('error'),
      messages: req.flash('message'),
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erreur interne');
    res.redirect('/');
  }
};