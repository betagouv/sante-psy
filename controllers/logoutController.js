module.exports.getLogout = function (req, res) {
  res.clearCookie('token').redirect('/');
};