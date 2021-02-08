const config = require('../utils/config');

module.exports.getFormUrl = async function getFormUrl(req, res) {
    try {
  
      const formUrl = config.demarchesSimplifieesUrl

      res.render('landing', {
        formUrl,
        errors: req.flash('error'),
        messages: req.flash('message'),
      });
    } catch (err) {
      console.error(err);
      req.flash('error', 'Erreur interne');
      res.redirect('/');
    }
  };
