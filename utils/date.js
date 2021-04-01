module.exports.isValidDate = (isoDateString) => {
  if (!isoDateString || isoDateString.length === 0) {
    return false
  }
  return !isNaN(new Date(Date.parse(isoDateString)))
}

module.exports.getDateNowPG = () => {
  return new Date().toISOString();
}

module.exports.parseDate = (date) => {
  return new Date(date).toISOString();
}

module.exports.getLastMonth = () => {
  /* The first index is 0. Adding + 1 to match with the data in the db */
  const currentMonth = (new Date().getUTCMonth() + 1);
  if(currentMonth === 1) {
    return 12
  }
  return currentMonth - 1;
}

module.exports.getDatePlusOneHour = () => {
  const expirationDate = new Date()
  return new Date(expirationDate.setHours(expirationDate.getHours() + 1)).toISOString();
}

module.exports.getFrenchMonthName = (monthNumber) => {
  switch(monthNumber) {
  case 1:
    return 'janvier';
  case 2:
    return 'février';
  case 3:
    return 'mars';
  case 4:
    return 'avril';
  case 5:
    return 'mai';
  case 6:
    return 'juin';
  case 7:
    return 'juillet';
  case 8:
    return 'août';
  case 9:
    return 'septembre';
  case 10:
    return 'octobre';
  case 11:
    return 'novembre';
  case 12:
    return 'décembre';
  default:
    console.error("invalid month", monthNumber);
    return 'Erreur';
  }
}
