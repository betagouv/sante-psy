const fs = require('fs')
const dbUniversities = require('../db/universities')

const parseFile = () => {
  const filePath = process.argv[2]
  fs.readFile(filePath, (err, datum) => {
    if (err) {
      console.log(err)
    }
    const separator = ','
    const buffStr = datum.toString()
    const [headerLine, ...lines] = buffStr.split('\n');
    const headers = headerLine.split(separator).slice(1, 4)
    console.log(headers)

    const data = lines.map(line => {
      return line.split(separator).slice(1, 4)
      .reduce(
        (obj, r, index) => ({
          ...obj,
          [headers[index]]: r
        }),
        {}
      )
    })
    insertEmailToUniversities(data)
    return data
  })
}

const insertEmailToUniversities = async (rawData) => {
  // console.log("Rawdata:", rawData)
  const universities = await dbUniversities.getUniversities()

  const unversitiesList = universities.map( uni => {
    // console.log("rawData['Universités']", rawData[0]['Universités'])
    console.log("uni name:", uni.name)
    const foundUni = rawData.find(myElement => myElement['Universités'].includes(uni.name) === true);
    if (foundUni) {
      uni.emailSSU  = foundUni['Pour envoi des nouvelles listes de psys']
      uni.emailUniversity = foundUni['Pour envoi du mail recap des séances']
    } else {
      console.log(`Aucun element trouvé dans le fichier pour ${uni.name}`)
    }
    return uni
  })

  // console.log("unversitiesList", unversitiesList)

  dbUniversities.saveUniversities(unversitiesList)
}


parseFile()

