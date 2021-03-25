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
    const currentConvention = conventionInfo === undefined ?
      {universityId: undefined, universityName: undefined, isConventionSigned: false} :
      conventionInfo
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

  try {
    const psychologistId = cookie.getCurrentPsyId(req)
    await dbPsychologists.updateConventionInfo(psychologistId, universityId, isConventionSigned)

    req.flash('info', `Vos informations de conventionnement sont bien enregistrées.`)
    return res.redirect('/psychologue/mes-remboursements')
  } catch (err) {
    console.error(`Could not update paying university for psy.`, err)
    req.flash('error', `Erreur pendant l'enregistrement. Vous pouvez réessayer.`)
    return res.redirect('/psychologue/mes-remboursements')
  }
}