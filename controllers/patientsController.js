const db = require('../utils/db')

module.exports.myPatients = async (req, res) => {
  const patients = await db.getPatients()
  res.render('myPatients', { patients: patients})
}

module.exports.newPatient = async (req, res) => {
  res.render('newPatient')
}

module.exports.createNewPatient = async (req, res) => {
  // todo input validation, protection against injections
  const firstNames = req.body['firstnames'].trim()
  if (!firstNames || firstNames.length === 0) {
    req.flash('error', 'Vous devez spécifier le.s prénom.s du patient.')
    return res.redirect('/nouveau-patient')
  }

  const lastName = req.body['lastname'].trim()
  if (!lastName || lastName.length === 0) {
    req.flash('error', 'Vous devez spécifier le nom du patient.')
    return res.redirect('/nouveau-patient')
  }

  // Todo test empty studentNumber
  const studentNumber = req.body['studentnumber']

  try {
    await db.insertPatient(firstNames, lastName, studentNumber)
    req.flash('info', `Le patient ${firstNames} ${lastName} a bien été créé.`)
    return res.redirect('/mes-seances')
  } catch (err) {
    req.flash('error', 'Erreur. Le patient n\'a pas été créé. Pourriez-vous réessayer ?')
    console.error('Erreur pour créer le patient', err)
    return res.redirect('/nouveau-patient')
  }
}
