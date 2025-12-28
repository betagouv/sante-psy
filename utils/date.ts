const now = (): string => new Date().toISOString();

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

/**
 * used to display date in editPatient
 */
const toFormatDDMMYYYY = (date: Date): string => {
  if (date) {
    return shortDateFormatter.format(date);
  }
  return null;
};

const parseForm = (date: string): Date => {
  if (date) {
    // Convert DD/MM/YYYY date
    return new Date(date.split('/').reverse().join('-'));
  }
  return null;
};

const dateToDashedString = (date: Date): string => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0'),
].join('-');

const getDatePlusOneHour = (): string => {
  const expirationDate = new Date();
  return new Date(expirationDate.setHours(expirationDate.getHours() + 1)).toISOString();
};

const getDatePlusTwoHours = (): Date => {
  const expirationDate = new Date();
  return new Date(expirationDate.setHours(expirationDate.getHours() + 2));
};

const getDatePlusSevenDays = (): Date => {
  const expirationDate = new Date();
  return new Date(expirationDate.setDate(expirationDate.getDate() + 7));
};

const getUTCDate = (date: Date) : Date => new Date(Date.UTC(
  date.getFullYear(),
  date.getMonth(),
  date.getDate(),
  date.getHours(),
  date.getMinutes(),
  date.getSeconds(),
  date.getMilliseconds(),
));

const subtractDays = (date: Date, days: number) : Date => {
  date.setDate(date.getDate() - days);

  return date;
};

export default {
  formatFrenchDateForm: 'DD/MM/YYYY',
  formatFrenchDate: dateFormatter.format,
  getDatePlusOneHour,
  getDatePlusTwoHours,
  getDatePlusSevenDays,
  getUTCDate,
  toFormatDDMMYYYY,
  parseForm,
  now,
  subtractDays,
  dateToDashedString,
};
