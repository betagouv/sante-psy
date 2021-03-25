const cookie = require('../utils/cookie')
const dbPsychologists = require('../db/psychologists')
const dbUniversities = require('../db/universities')

module.exports.reimbursement = async function reimbursement(req, res) {
  let universityList = []
  try {
    universityList = await dbUniversities.getUniversities()
    if (!universityList || universityList.length === 0) {
      throw new Error('No universities in db')
    }
    universityList.sort((a, b) => {
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    })
  } catch (err) {
    console.error(`Could not fetch universities`, err)
    req.flash('error', `La page Remboursement n'arrive pas à s'afficher.`)
    return res.redirect('/psychologue/mes-seances')
  }

  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    const conventionInfo = await dbPsychologists.getConventionInfo(psychologistId)
    let currentConvention = conventionInfo
    if (conventionInfo === undefined) {
      currentConvention = {universityId: undefined, universityName: undefined, isConventionSigned: false}
    }
    res.render('reimbursement', {
      pageTitle: 'Remboursement',
      universities: universityList,
      currentConvention: currentConvention,
      showForm: conventionInfo === undefined,
    });
  } catch (err) {
    console.error(`Could not fetch currentPsy or conventionInfo`, err)
    req.flash('error', `La page Remboursement n'arrive pas à s'afficher.`)
    return res.redirect('/psychologue/mes-seances')
  }
}

// todo validators
module.exports.updateConventionInfo = async (req, res) => {
  // todo validation

  const universityId = req.body['university']
  const isConventionSigned = req.body.signed === 'yes'
  // todo error if no radio is checked ?

  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    const updated = await dbPsychologists.updateConventionInfo(psychologistId, universityId, isConventionSigned)

    // todo specific info message for this partial ?
    req.flash('info', `C'est noté ! Vous avez conventionné avec ${universityId}.`) // todo use name not id

    return res.redirect('/psychologue/mes-remboursements')
  } catch (err) {
    console.error(`Could not update paying university for psy.`, err)
    req.flash('error', `Erreur pendant l'enregistrement. Vous pouvez réessayer.`)
    return res.redirect('/psychologue/mes-remboursements')
  }
}