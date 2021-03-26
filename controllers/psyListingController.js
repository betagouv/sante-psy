const dbPsychologists = require('../db/psychologists')

function getCityAndPostalCode(address) {
  //const test = new RegExp(/^(.+?)(?=\d{5})/, 'g');
  const test = new RegExp(/^(.+?)(?=\d{5})(\w* \w*)/, 'g');
  //const test = new RegExp(/^(.+?)(?=\d{5})(\w* \w*?-\w*)/, 'g');
  const postalCitySplit = address.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(test);
  console.log("postalCitySplit", postalCitySplit);

  if(postalCitySplit.length === 1) {
    return 'error';
  } else {
    return postalCitySplit[postalCitySplit.length - 2];
  }
}

module.exports.getPsychologist  = async function getPsychologist(req, res) {
  try {
    const time = `getting all psychologists from Postgres (query id #${Math.random().toString()})`;
    console.time(time);
    const  psyList = await dbPsychologists.getPsychologists()
    console.timeEnd(time);

    const psyListWithCityAndPostalCode = psyList.map ( psy => {
      psy.cityPostalCode = psy.address.split("")
    })
    res.render('psyListing', {
      psyList,
      errors: req.flash('error')
    });
  } catch (err) {
    req.flash('error', 'Impossible de récupérer les psychologues. Réessayez ultérieurement.')
    console.error('getPsychologist', err);
    res.render('psyListing', {
      psyList: [],
    });
  }
};
