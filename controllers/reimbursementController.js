const dbUniversities = require('../db/universities')

module.exports.reimbursement = async function reimbursement(req, res) {
  let universityList = []
  try {
    universityList = await dbUniversities.getUniversities()
    // Todo if no universities, don't display the form at all ?
  } catch (err) {
    // todo do something
  }

  res.render('reimbursement', { pageTitle: 'Remboursement', universities: universityList});
}

// todo validators
module.exports.updatePayingUniversity = (req, res) => {
  // todo validation

  const university = req.body['university']

  // todo save value

  // todo specific info message for this partial ?
  req.flash('info', `C'est noté ! Vous avez conventionné avec ${university}.`) // todo use name not id
  return res.redirect('/psychologue/mes-remboursements')
}