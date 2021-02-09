const config = require('../utils/config');

module.exports.getLanding = async function getFormUrl(req, res) {
  const formUrl = config.demarchesSimplifieesUrl

  res.render('landing', {
    formUrl,
  });
};
