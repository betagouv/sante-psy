const dbUniversities = require('../db/universities')
const dbPsychologists = require('../db/psychologists')
const demarchesSimplifiees = require('../utils/demarchesSimplifiees')
const departementToUniversityName = require('./departementToUniversityName')
const psyToUni = require('./psyToUni')

const getUniversityId = function getUniversityId(universities, name) {
  const foundUni = universities.find ( uni => {
    return uni.name.toString().trim() === name.toString().trim()
  })

  if(foundUni) {
    return foundUni.id
  } else {
    return undefined
  }
}
const getUniversityName = function getUniversityName(universities, id) {
  const foundUni =  universities.filter ( uni => {
    uni.id === id
  })

  if(foundUni) {
    return foundUni.name
  } else {
    return undefined
  }
}

/**
 * Update a list of special psy from a excel sheet to match them with a university
 * can be run and rerun again
 */
const run = async () => {
  console.log("Match psychologists to universities...")
  const universities = await dbUniversities.getUniversities()
  console.log(`${universities.length} universities`)
  const psychologists = await dbPsychologists.getPsychologistsDeclaredUniversity()

  const statsNoEmailFound = []
  const statsConflictingDeclaredUniversity = []

  const specialCasePsychologists = psychologists.filter( psy => psyToUni[psy.personalEmail] !== undefined)
  let needToWait = specialCasePsychologists
    .map( psy => {
      const universityIdToAssign = getUniversityId(universities, psyToUni[psy.personalEmail])
      if (!universityIdToAssign) {
        console.warn(`No university found for psy ${psy.personalEmail}
        - psy id ${psy.dossierNumber}`)

        statsNoEmailFound.push(psy)
        return Promise.resolve();
      } else {
        if( (psy.declaredUniversityId  !== null) && (psy.declaredUniversityId !== universityIdToAssign) ) {
          console.log('Psy', psy.dossierNumber, 'already declared', psy.declaredUniversityId,
            'but was assigned', universityIdToAssign, getUniversityName(universities, universityIdToAssign))

          psy.assignedUniversity = universityIdToAssign;
          statsConflictingDeclaredUniversity.push(psy)
        }
        return dbPsychologists.saveAssignedUniversity(psy.dossierNumber, universityIdToAssign)
      }
    })

  await Promise.all(needToWait);
  console.log(`${specialCasePsychologists.length} special case psychologists done`)
  console.log('\nNo personalEmail found :', statsNoEmailFound.length, 'psys')
  console.log('\nConflict between declaredUniversity and assignedUniversity :', statsConflictingDeclaredUniversity)

  // eslint-disable-next-line no-process-exit
  process.exit(1)
}

run();