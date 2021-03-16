module.exports.getLogout = function getLogout (req, res) {
  console.log("log out");
  req.flash('info', `Vous êtes déconnecté.`);
  res.clearCookie('token').redirect('/');
};