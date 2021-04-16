const dbPsychologists = require('../db/psychologists')
const dbUniversities = require('../db/universities')

const departementToUniversityName = require('./departementToUniversityName')
console.log('departementToUniversityName', Object.entries(departementToUniversityName).length,
  departementToUniversityName)

const makeDepartementToUniversityIdTable = async () => {
  const universities = await dbUniversities.getUniversities()
  console.log(universities.length, 'universities', universities)
  // [{ id: 'my-univ-id', name: 'Avignon'}]

  const universityNameToId = Object.fromEntries(
    universities.map(university => {
      return [ university.name, university.id ]
    })
  )
  console.log('universityNameToId', Object.entries(universityNameToId).length, universityNameToId)
  // { 'Avignon': 'my-univ-id'}

  const universityIdToName = Object.fromEntries(
    universities.map(university => {
      return [ university.id, university.name ]
    })
  )
  console.log('universityNameToId', Object.entries(universityNameToId).length, universityNameToId)
  // { 'my-univ-id': 'Avignon' }

  const departementToId = Object.fromEntries(
    Object.entries(departementToUniversityName).map(([departement, name]) => {
      return [ departement, universityNameToId[name]]
    })
  )
  console.log('departementToId', Object.entries(departementToId).length, departementToId)
  // { '55': 'my-univ-id'}

  return [universityIdToName, departementToId]
}

/**
 * Output : "55"
 * @param {} departementString ex : '55 - Indre-et-Loire'
 */
const getDepartementNumberFromString = (departementString) => {
  // Note : this is not robust. If Demarches Simplifiées changes their format it will break.
  const parts = departementString.split(' - ')
  return parts[0]
}

const run = async () => {
  const [universityIdToName, departementToUnivId] = await makeDepartementToUniversityIdTable() // todo try catch

  let psychologists = await dbPsychologists.getPsychologists()
  //psychologists = psychologists.slice(0, 10) // todo remove

  const statsNoUniversityFound = {}
  const statsConflictingDeclaredUniversity = {}
  psychologists.forEach((psychologist) => {
    // Don't rewrite assignedUniversityId if it's already written, in case we made changes by hand that should not be
    // overwritten by the script.
    if (psychologist.assignedUniversityId) {
      console.log('Already assigned', psychologist.dossierNumber, 'to', psychologist.assignedUniversityId)
      // todo output object for debug ? stats ?
      return
    }

    // Find universityId for this psychologist
    const universityIdToAssign = departementToUnivId[getDepartementNumberFromString(psychologist.departement)]
    if (!universityIdToAssign) {
      console.log(`No university found for departement ${psychologist.departement}
      - psy id ${psychologist.dossierNumber}
      - ${psychologist.lastName} ${psychologist.firstNames}`)

      if (!statsNoUniversityFound[psychologist.departement]) {
        statsNoUniversityFound[psychologist.departement] = []
      }
      statsNoUniversityFound[psychologist.departement].push(psychologist.dossierNumber)
      return
    }

    // If the psychologist declared another university, something is wrong ! Do not write assignedUniversityId.
    if (psychologist.declaredUniversityId && psychologist.declaredUniversityId !== universityIdToAssign) {
      console.log('Psy', psychologist.dossierNumber, 'already declared', psychologist.declaredUniversityId,
        'so will not assign', universityIdToAssign, universityIdToName[universityIdToAssign])
      if (!statsConflictingDeclaredUniversity[psychologist.departement]) {
        statsConflictingDeclaredUniversity[psychologist.departement] = []
      }
      statsConflictingDeclaredUniversity[psychologist.departement].push(
        {
          psychologistId : psychologist.dossierNumber,
          declaredUniversityId: psychologist.declaredUniversityId,
        }
      )
      return
    }

    // Write assignedUniversityId
    // todo write
    console.log('Assigned', psychologist.dossierNumber, 'of departement', psychologist.departement,
      'to university', universityIdToAssign, universityIdToName[universityIdToAssign])
  })

  console.log('------------')
  console.log('No university found : ')
  Object.entries(statsNoUniversityFound).forEach(([departement, psyList]) => {
    console.log(departement, ': ', psyList.length, 'psys')
  })

  console.log('\nConflict between declaredUniversity and assignedUniversity :', statsConflictingDeclaredUniversity)
}
module.exports.run = run
