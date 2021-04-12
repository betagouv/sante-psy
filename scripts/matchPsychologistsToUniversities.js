const dbPsychologists = require('../db/psychologists')

const departementToUniv = {
  '37 - Indre-et-Loire': 'Tours',
  '34 - Hérault': 'Montpellier 3',
  '38 - Isère': 'Grenoble Alpes',
}

const run = async () => {
  const psychologists = await dbPsychologists.getPsychologists()
  psychologists.forEach((psychologist) => {
    const universityName = departementToUniv[psychologist.departement]
    if (!universityName) {
      console.log(`No university found for departement ${psychologist.departement}
      - psy id ${psychologist.dossierNumber}
      - ${psychologist.lastName} ${psychologist.firstNames}`)
      return
    }

  })
}
