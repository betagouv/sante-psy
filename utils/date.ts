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

const getDatePlusOneHour = (): string => {
  const expirationDate = new Date();
  return new Date(expirationDate.setHours(expirationDate.getHours() + 1)).toISOString();
};

const getUTCDate = (date: Date) : Date => new Date(Date.UTC(
  date.getUTCFullYear(),
  date.getUTCMonth(),
  date.getUTCDate(),
  date.getUTCHours(),
  date.getUTCMinutes(),
  date.getUTCSeconds(),
  date.getUTCMilliseconds(),
));

const getUnivYear = (date: Date) : string => {
  const SEPTEMBER = 8;
  const DECEMBER = 11;
  const cycle = (date.getMonth() >= SEPTEMBER && date.getMonth() <= DECEMBER)
    ? `${date.getFullYear()}-${date.getFullYear() + 1}`
    : `${date.getFullYear() - 1}-${date.getFullYear()}`;
  return cycle;
};

const subtractDays = (date: Date, days: number) : Date => {
  date.setDate(date.getDate() - days);

  return date;
};

export default {
  formatFrenchDateForm: 'DD/MM/YYYY',
  formatFrenchDate: dateFormatter.format,
  getDatePlusOneHour,
  getUTCDate,
  toFormatDDMMYYYY,
  parseForm,
  now,
  getUnivYear,
  subtractDays,
};
