const config = require('../utils/config');

module.exports.getFaq = async function getFaq(req, res) {
  const formUrl = config.demarchesSimplifieesUrl;

  res.render('faq', {
    formUrl,
  });
};
