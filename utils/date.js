const formatFrenchDateForm = 'DD/MM/YYYY';
module.exports.formatFrenchDateForm = formatFrenchDateForm;

module.exports.isValidDate = (isoDateString) => {
  if (!isoDateString || isoDateString.length === 0) {
    return false;
  }
  return !Number.isNaN(new Date(Date.parse(isoDateString)));
};

module.exports.getDateNowPG = () => new Date().toISOString();

/**
 * @see https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 */
const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

module.exports.formatFrenchDate = (date) => dateFormatter.format(date);

/**
 * used to display date in editPatient
 */
module.exports.toFormatDDMMYYYY = (date) => {
  if (date) {
    return shortDateFormatter.format(date);
  }
  return null;
};

function parseDateForm(date) {
  if (date) {
    const [day, month, year] = date.split('/');
    // year - month - day
    return new Date(`${year}-${month}-${day}`);
  }
  return null;
}
module.exports.parseDateForm = parseDateForm;

module.exports.parseDate = (date) => new Date(date).toISOString();

module.exports.getLastMonthAndYear = (now) => {
  const currentYear = now.getFullYear();
  /* The first index is 0. Adding + 1 to match with the data in the db */
  const currentMonth = (now.getUTCMonth() + 1);
  if (currentMonth === 1) {
    return { lastMonth: 12, year: currentYear - 1 };
  }
  return { lastMonth: currentMonth - 1, year: currentYear };
};

module.exports.getDatePlusOneHour = () => {
  const expirationDate = new Date();
  return new Date(expirationDate.setHours(expirationDate.getHours() + 1)).toISOString();
};

module.exports.getFrenchMonthName = (monthNumber) => {
  switch (monthNumber) {
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
    console.error('invalid month', monthNumber);
    return 'Erreur';
  }
};

function isSameMonth(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}
module.exports.isSameMonth = isSameMonth;
