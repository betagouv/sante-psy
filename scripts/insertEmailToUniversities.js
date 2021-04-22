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
    // console.log('data', data)
    insertEmailToUniversities(data)
    return data
  })
}

const insertEmailToUniversities = async (rawData) => {
  // console.log("Rawdata:", rawData)
  const universities = await dbUniversities.getUniversities()
  // console.log("universities without emails", universities);

  const unversitiesList = universities.map( uni => {
    // console.log("rawData['Universités']", rawData[0]['Universités'])
    console.log("uni name:", uni.name)
    const foundUni = rawData.find(myElement => myElement['Universités'].includes(uni.name) === true);
    if (foundUni) {
      console.log("foundUni", foundUni);
      uni.emailSSU = foundUni['Pour envoi des nouvelles listes de psys'].split(';').map(email => email.trim())
      uni.emailUniversity = foundUni['Pour envoi du mail recap des séances'].split(';').map(email => email.trim())
    } else {
      console.log(`Aucun element trouvé dans le fichier pour ${uni.name}`)
    }
    return uni
  })

  // console.log("unversitiesList", unversitiesList)

  dbUniversities.saveUniversities(unversitiesList)
}


parseFile()

