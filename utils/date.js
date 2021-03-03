module.exports.isValidDate = (isoDateString) => {
  if (!isoDateString || isoDateString.length === 0) {
    return false
  }
  return !isNaN(new Date(Date.parse(isoDateString)))
}

// Julien : pourquoi il y a "PG" dans le nom ?
module.exports.getDateNowPG = () => {
  return new Date().toISOString();
}

module.exports.parseDate = (date) => {
  return new Date(date).toISOString();
}

module.exports.getDatePlusOneHour = () => {
  const expirationDate = new Date()
  return new Date(expirationDate.setHours(expirationDate.getHours() + 1)).toISOString();
}

