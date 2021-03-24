const cookie = require('../utils/cookie')
const dbPsychologists = require('../db/psychologists')
const dbUniversities = require('../db/universities')

module.exports.reimbursement = async function reimbursement(req, res) {
  let universityList = []
  try {
    universityList = await dbUniversities.getUniversities()
    universityList.sort((a, b) => a < b)
    // Todo if no universities, don't display the form at all ?
  } catch (err) {
    // todo do something
    console.log(err)
  }

  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    const payingUniversity = await dbPsychologists.getPayingUniversity(psychologistId)
    res.render('reimbursement', {
      pageTitle: 'Remboursement',
      universities: universityList,
      currentUniversity: payingUniversity === undefined ? {id: undefined, name: undefined} : payingUniversity,
      showForm: payingUniversity === undefined,
    });
  } catch (err) {
    // todo do something
    console.error(err)
    res.render('reimbursement', { pageTitle: 'Remboursement', universities: universityList});
  }
}

// todo validators
module.exports.updatePayingUniversity = async (req, res) => {
  // todo validation

  const universityId = req.body['university']

  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    const updated = await dbPsychologists.updatePayingUniversity(psychologistId, universityId)
    console.log('updated', updated)

    // todo specific info message for this partial ?
    req.flash('info', `C'est noté ! Vous avez conventionné avec ${universityId}.`) // todo use name not id

    return res.redirect('/psychologue/mes-remboursements')
  } catch (err) {
    console.error(`Could not update paying university for psy.`, err)
    req.flash('error', `Erreur pendant l'enregistrement. Vous pouvez réessayer.`)
    return res.redirect('/psychologue/mes-remboursements')
  }
}