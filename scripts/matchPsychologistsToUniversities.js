const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)
const dbUniversities = require('../db/universities')

const departementToUniversityName = require('./departementToUniversityName')
console.log('departementToUniversityName', Object.entries(departementToUniversityName).length,
  departementToUniversityName)

const getPsychologists = async () => {
  try {
    const psychologists = knex.column(
      knex.raw('UPPER("lastName") as "lastName"'), // force to use quote otherwise knex understands it as "lastname"
      'firstNames',
      'personalEmail',
      'departement',
      'dossierNumber',
      'payingUniversityId as declaredUniversityId') // todo declaredUniversityId
        .select()
        .from('psychologists') // todo import table name
        .whereNot('archived', true)
        .where('state', 'accepte') // todo import stats
        .orderBy('dossierNumber');
    return psychologists;
  } catch (err) {
    console.error(`Impossible de récupérer les psychologistes`, err)
    throw new Error(`Impossible de récupérer les psychologistes`)
  }
}

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

  return [universityNameToId, universityIdToName, departementToId]
}

/**
 * Output : "55"
 * @param {} departementString ex : '55 - Indre-et-Loire'
 */
const getDepartementNumberFromString = (departementString) => {
  if (!departementString) {
    return null
  }
  // Note : this is not robust. If Demarches Simplifiées changes their format it will break.
  const parts = departementString.split(' - ')
  return parts[0]
}

const run = async () => {
  // todo try catch
  const [universityNameToId, universityIdToName, departementToUnivId] = await makeDepartementToUniversityIdTable()

  let psychologists = await getPsychologists()
  //psychologists = psychologists.slice(0, 10) // todo remove

  const statsNoUniversityFound = {}
  const statsNoDepartementFound = []
  const statsConflictingDeclaredUniversity = {}
  const statsAssignedWithoutProblem = []
  const statsAlreadyAssigned = []
  psychologists.forEach((psychologist) => {
    if (psychologist.assignedUniversityId) {
      // Don't rewrite assignedUniversityId if it's already written, in case we made changes by hand that should not be
      // overwritten by the script.
      console.log('Already assigned', psychologist.dossierNumber, 'to', psychologist.assignedUniversityId)
      statsAlreadyAssigned.push(psychologist.dossierNumber)
      return
    }

    // Find universityId for this psychologist
    const departement = getDepartementNumberFromString(psychologist.departement)
    if (!departement) {
      console.log(`No departement found
          - psy id ${psychologist.dossierNumber}
          - ${psychologist.lastName} ${psychologist.firstNames}`)

      statsNoDepartementFound.push(psychologist.dossierNumber)
      return
    }
    const universityIdToAssign = departementToUnivId[departement]
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
    const noUniversityId = universityNameToId['--- Aucune pour le moment']
    if (psychologist.declaredUniversityId &&
        psychologist.declaredUniversityId !== noUniversityId && // the psy declared "Aucune"
        psychologist.declaredUniversityId !== universityIdToAssign) {
      console.log('Psy', psychologist.dossierNumber, 'already declared', psychologist.declaredUniversityId,
        'so will not assign', universityIdToAssign, universityIdToName[universityIdToAssign])
      if (!statsConflictingDeclaredUniversity[psychologist.departement]) {
        statsConflictingDeclaredUniversity[psychologist.departement] = []
      }
      statsConflictingDeclaredUniversity[psychologist.departement].push(
        {
          psychologistId : psychologist.dossierNumber,
          psychologistEmail: psychologist.personalEmail,
          declaredUniversityId: psychologist.declaredUniversityId,
          declaredUniversityName: universityIdToName[psychologist.declaredUniversityId],
          universityIdToAssign: universityIdToAssign,
          universityNameToAssign: universityIdToName[universityIdToAssign]
        }
      )
      return
    }

    // Write assignedUniversityId
    // todo write
    console.log('Assigned', psychologist.dossierNumber, 'of departement', psychologist.departement,
      'to university', universityIdToAssign, universityIdToName[universityIdToAssign])
    statsAssignedWithoutProblem.push(psychologist.dossierNumber)
  })

  console.log('------------')
  console.log('No university to assign automatically : ')
  Object.entries(statsNoUniversityFound).forEach(([departement, psyList]) => {
    console.log(departement, ': ', psyList.length, 'psys')
  })

  console.log('\nNo departement found :', statsNoDepartementFound.length, 'psys')

  console.log('\nConflict between declaredUniversity and assignedUniversity :', statsConflictingDeclaredUniversity)

  console.log('\nAssigned without problem :', statsAssignedWithoutProblem.length, 'psys')

  console.log('\nAlready assigned, so this script did nothing :', statsAlreadyAssigned.length, 'psys')
}

module.exports.run = run
