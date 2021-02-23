const dbPatient = require('../db/patients')

module.exports.newPatient = async (req, res) => {
  res.render('newPatient', { pageTitle: 'Nouveau patient' })
}

module.exports.createNewPatient = async (req, res) => {
  console.debug("createNewPatient - req.body", req.body);
  // todo input validation, protection against injections
  const firstNames = req.body['firstNames'].trim()
  if (!firstNames || firstNames.length === 0) {
    console.error("Invalide firstNames", firstNames);
    req.flash('error', 'Vous devez spécifier le.s prénom.s du patient.')
    return res.redirect('/nouveau-patient')
  }

  const lastName = req.body['lastName'].trim()
  if (!lastName || lastName.length === 0) {
    console.error("Invalide lastName", lastName);
    req.flash('error', 'Vous devez spécifier le nom du patient.')
    return res.redirect('/nouveau-patient')
  }

  const INE = req.body['INE']
  if (!INE || INE.length === 0) {
    console.error("Invalide INE", INE);
    req.flash('error', 'Vous devez spécifier l\'INE.')
    return res.redirect('/nouveau-patient')
  }

  try {
    await dbPatient.insertPatient(firstNames, lastName, INE)
    console.log("new patient created");
    req.flash('info', `Le patient ${firstNames} ${lastName} a bien été créé.`)
    return res.redirect('/mes-seances')
  } catch (err) {
    req.flash('error', 'Erreur. Le patient n\'a pas été créé. Pourriez-vous réessayer ?')
    console.error('Erreur pour créer le patient', err)
    return res.redirect('/nouveau-patient')
  }
}
