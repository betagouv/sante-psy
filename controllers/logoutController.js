module.exports.getLogout = function getLogout (req, res) {
  req.flash('info', `Vous êtes déconnecté.`);
  res.clearCookie('token').redirect('/');
};