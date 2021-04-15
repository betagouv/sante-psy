const dbPsychologists = require('../db/psychologists')
const dbUniversities = require('../db/universities')

const departementToUniversityName = require('./departementToUniversityName')
console.log('departementToUniversityName', Object.entries(departementToUniversityName).length,
  departementToUniversityName)

const makeDepartementToUniversityIdTable = async () => {
  const universities = await dbUniversities.getUniversities()
  console.log(universities.length, 'universities', universities)
  // [{ id: 'my-univ-id', name: 'abc'}]

  const universityNameToId = Object.fromEntries(
    universities.map(university => {
      return [ university.name, university.id ]
    })
  )
  console.log('universityNameToId', Object.entries(universityNameToId).length, universityNameToId)
  // { 'abc': 'my-univ-id'}

  const departementToId = Object.fromEntries(
    Object.entries(departementToUniversityName).map(([departement, name]) => {
      return [ departement, universityNameToId[name]]
    })
  )
  console.log('departementToId', Object.entries(departementToId).length, departementToId)
  // { 'Indre-et-Loire': 'my-univ-id'}

  return departementToId
}

module.exports.run = async () => {
  const departementToUnivId = await makeDepartementToUniversityIdTable() // todo try catch

  let psychologists = await dbPsychologists.getPsychologists()
  //psychologists = psychologists.slice(0, 10) // todo remove

  psychologists.forEach((psychologist) => {
    // Don't rewrite assignedUniversityId if it's already written, in case we made changes by hand that should not be
    // overwritten by the script.
    if (psychologist.assignedUniversityId) {
      console.log('Already assigned', psychologist.dossierNumber, 'to', psychologist.assignedUniversityId)
      // todo output object for debug ? stats ?
      return
    }

    // Find universityId for this psychologist
    const universityIdToAssign = departementToUnivId[psychologist.departement]
    if (!universityIdToAssign) {
      console.log(`No university found for departement ${psychologist.departement}
      - psy id ${psychologist.dossierNumber}
      - ${psychologist.lastName} ${psychologist.firstNames}`)
      return
    }

    // If the psychologist declared another university, something is wrong ! Do not write assignedUniversityId.
    if (psychologist.declaredUniversityId && psychologist.declaredUniversityId !== universityIdToAssign) {
      console.log('Psy', psychologist.dossierNumber, 'already declared', psychologist.declaredUniversityId,
        'so will not assign', universityIdToAssign)
      // todo output object for debug ? stats ?
      return
    }

    // Write assignedUniversityId
    // todo write
    console.log('Assigned', psychologist.dossierNumber, 'of departement', psychologist.departement,
      'to university', universityIdToAssign)
  })
}
