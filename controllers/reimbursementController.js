
module.exports.reimbursement = async function reimbursement(req, res) {
  // todo fetch from DB
  const universities = ['Aix-Marseille', 'Grenoble Alpes']

  res.render('reimbursement', { pageTitle: 'Remboursement', universities: universities});
}

// todo validators
module.exports.updatePayingUniversity = (req, res) => {
  // todo validation

  const university = req.body['university']

  // todo save value

  // todo specific info message for this partial ?
  req.flash('info', `C'est noté ! Vous avez conventionné avec ${university}.`)
  return res.redirect('/psychologue/mes-remboursements')
}