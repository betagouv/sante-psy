const shortFrenchMonthNames = [
  'Jan',
  'Fev',
  'Mar',
  'Avr',
  'Mai',
  'Jun',
  'Jul',
  'Aou',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const longFrenchMonthNames = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

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

const formatFrenchDate = date => dateFormatter.format(date);

const utcDate = dateString => {
  const date = new Date(dateString);
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0,
    0,
    0,
  );
};

/**
 * used to display date in editPatient
 */
const formatDDMMYYYY = date => {
  if (date) {
    return shortDateFormatter.format(date);
  }
  return '';
};

const formatStringToDDMMYYYY = stringDate => {
  const date = new Date(stringDate);
  if (!date.getTime()) {
    return ''; // handle invalid dates
  }
  return formatDDMMYYYY(date);
};

const parseDateForm = date => {
  if (date) {
    const [day, month, year] = date.split('/');
    // year - month - day
    return new Date(`${year}-${month}-${day}`);
  }
  return null;
};

const convertLocalToUTCDate = date => {
  if (!date) {
    return date;
  }
  let dateUTC = new Date(date);
  dateUTC = new Date(
    Date.UTC(dateUTC.getFullYear(), dateUTC.getMonth(), dateUTC.getDate()),
  );
  return dateUTC;
};

const formatMonth = m => {
  if (m && m.year && m.month) return `${longFrenchMonthNames[m.month - 1]} ${m.year}`;
  return '?';
};

const addAutoSlashToDate = value => {
  const cleanedValue = value.replace(/\D/g, '');

  let formattedValue = cleanedValue;
  if (cleanedValue.length > 2) {
    formattedValue = `${cleanedValue.substring(0, 2)}/${cleanedValue.substring(2)}`;
  }
  if (cleanedValue.length > 4) {
    formattedValue = `${cleanedValue.substring(0, 2)}/${cleanedValue.substring(2, 4)}/${cleanedValue.substring(4, 8)}`;
  }

  return formattedValue;
};

export {
  formatFrenchDate,
  formatDDMMYYYY,
  parseDateForm,
  convertLocalToUTCDate,
  formatMonth,
  shortFrenchMonthNames,
  utcDate,
  formatStringToDDMMYYYY,
  addAutoSlashToDate,
};
