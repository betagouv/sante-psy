const config = require('../utils/config');

module.exports.getLanding = async function getFormUrl(req, res) {
  const formUrl = config.demarchesSimplifieesUrl;
  const { featurePsyList, featurePsyPages } = config;

  res.render('landing', {
    formUrl,
    featurePsyList,
    featurePsyPages,
  });
};
