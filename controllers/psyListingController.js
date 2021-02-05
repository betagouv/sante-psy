const utils = require('../utils/demarchesSimplifiees');

module.exports.getPsychologist  = async function getPsychologist(req, res) {
  try {
    console.log(`req received : ${req}`);

    // req.body.address
    const address = "test"; // @TODO use me to filter address (or delete me :p)

    //@TODO query demarches simplifiées API
    const psyList = await utils.getPsychologistList(address, true);

    //@TODO fix me psychologist list received from the API: [object Object]
    console.log(`psychologist list received from the API: ${psyList}`);

    const title = 'La liste des psychologues qui sont là pour vous aider';
    res.render('psyListing', {
      title,
      address, 
      psyList,
      errors: req.flash('error'),
      messages: req.flash('message'),
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erreur interne');
    res.redirect('/');
  }
};