const faq = require('../utils/faq/faq');

module.exports.getFaq = async function getFaq(req, res) {
  res.render('faq', {
    faq,
  });
};
