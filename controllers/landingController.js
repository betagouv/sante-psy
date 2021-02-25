const config = require('../utils/config');

module.exports.getLanding = async function getFormUrl(req, res) {
  const formUrl = config.demarchesSimplifieesUrl;
  const featurePsyList = config.featurePsyList;
  const featurePsyPages = config.featurePsyPages;

  res.render('landing', {
    formUrl,
    featurePsyList,
    featurePsyPages,
  });
};
