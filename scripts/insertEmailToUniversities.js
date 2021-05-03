const fs = require('fs');
const dbUniversities = require('../db/universities');

const insertEmailToUniversities = async (universitiesArray) => {
  console.debug('universitiesArray:', universitiesArray);
  const universities = await dbUniversities.getUniversities();

  const unversitiesList = universities.map((uni) => {
    console.log(`Trying to add university ${uni.name} to DB...`);
    const foundUni = universitiesArray.find((myElement) => myElement['Universités'] === uni.name);
    if (foundUni) {
      console.log(`Add ${uni.name} to list to save`);

      // emailSSU
      if (foundUni['Pour envoi des nouvelles listes de psys'] !== null) {
        uni.emailSSU = foundUni['Pour envoi des nouvelles listes de psys'];
      } else {
        console.warn(`emailSSU is missing for ${uni.name}`);
      }

      // emailUniversity
      if (foundUni['Pour envoi du mail recap des séances'] !== null) {
        uni.emailUniversity = foundUni['Pour envoi du mail recap des séances'];
      } else {
        console.warn(`emailUniversity is missing for ${uni.name}`);
      }
    } else {
      console.log(`Aucun element trouvé dans le fichier pour ${uni.name} -- reconsultez la liste d'université ?`);
    }
    return uni;
  });

  console.debug('insertEmailToUniversities - new unversities list', unversitiesList);

  await dbUniversities.saveUniversities(unversitiesList);

  // eslint-disable-next-line no-process-exit
  process.exit(1);
};

const parseFile = () => {
  const filePath = process.argv[2];
  fs.readFile(filePath, (err, datum) => {
    if (err) {
      console.log(err);
    }
    const separator = ',';
    const buffStr = datum.toString();
    const [headerLine, ...lines] = buffStr.split('\n');
    const headers = headerLine.split(separator).slice(1, 4);
    console.log(headers);

    const data = lines.map((line) => line.split(separator).slice(1, 4)
      .reduce(
        (obj, r, index) => ({
          ...obj,
          [headers[index]]: r,
        }),
        {},
      ));
    insertEmailToUniversities(data);
    return data;
  });
};

parseFile();
