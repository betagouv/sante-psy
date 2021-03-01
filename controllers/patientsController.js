const dbPatient = require('../db/patients')

module.exports.newPatient = async (req, res) => {
  res.render('newPatient', { pageTitle: 'Nouveau patient' })
}

module.exports.editPatient = async (req, res) => {
  const patientId = req.body['patientid']
  const patientFirstNames = req.body['firstnames']
  const patientLastName = req.body['lastname']
  const patientINE = req.body['ine']

  try {
    await dbPatient.updatePatient(patientId, patientFirstNames, patientLastName, patientINE)
    req.flash('info', `Le patient a bien été modifié.`)
  } catch (err) {
    req.flash('error', 'Erreur. Le patient n\'est pas modifié. Pourriez-vous réessayer ?')
    console.error('Erreur pour modifier le patient', err)
  }
  return res.redirect('/mes-seances')
}

module.exports.getEditPatient = async (req, res) => {
  const patientId = req.body['patientid']

  try {
    const patient = await dbPatient.getPatientById(patientId)
    console.debug(`Rendering getEditPatient for ${patientId}`)
    res.render('editPatient', {
      pageTitle: 'Modifier un patient',
      patient: patient
    })
  } catch (err) {
    req.flash('error', 'Erreur lors de la sauvegarde.')
    console.error('Error getEditPatient', err)
  }
}

module.exports.createNewPatient = async (req, res) => {
  console.debug("createNewPatient - req.body", req.body);
  // todo input validation, protection against injections
  const firstNames = req.body['firstnames'].trim()
  if (!firstNames || firstNames.length === 0) {
    console.error("Invalide firstNames");
    req.flash('error', 'Vous devez spécifier le.s prénom.s du patient.')
    return res.redirect('/nouveau-patient')
  }

  const lastName = req.body['lastname'].trim()
  if (!lastName || lastName.length === 0) {
    console.error("Invalide lastName");
    req.flash('error', 'Vous devez spécifier le nom du patient.')
    return res.redirect('/nouveau-patient')
  }

  const INE = req.body['ine']
  if (!INE || INE.length === 0) {
    console.error("INE is empty");
    req.flash('info', 'Vous pourrez remplir le numero INE plus tard.')
  }

  try {
    await dbPatient.insertPatient(firstNames, lastName, INE)
    req.flash('info', `Le patient ${firstNames} ${lastName} a bien été créé.`)
    return res.redirect('/mes-seances')
  } catch (err) {
    req.flash('error', 'Erreur. Le patient n\'a pas été créé. Pourriez-vous réessayer ?')
    console.error('Erreur pour créer le patient', err)
    return res.redirect('/nouveau-patient')
  }
}
