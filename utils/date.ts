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
    const [day, month, year] = date.split('/');
    // year - month - day
    return new Date(`${year}-${month}-${day}`);
  }
  return null;
};

const getDatePlusOneHour = (): string => {
  const expirationDate = new Date();
  return new Date(expirationDate.setHours(expirationDate.getHours() + 1)).toISOString();
};

export default {
  formatFrenchDateForm: 'DD/MM/YYYY',
  formatFrenchDate: dateFormatter.format,
  getDatePlusOneHour,
  toFormatDDMMYYYY,
  parseForm,
  now,
};
