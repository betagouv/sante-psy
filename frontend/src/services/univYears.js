import { utcDate } from 'services/date';

const currentUnivYear = (separator = '/') => {
  const SEPTEMBER = 8;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  if (currentMonth < SEPTEMBER) {
    return `${currentYear - 1}${separator}${currentYear}`;
  }
  return `${currentYear}${separator}${currentYear + 1}`;
};

const getUnivYear = (date, separator = '/') => {
  const SEPTEMBER = 8;
  const dateUtc = utcDate(date);
  const currentMonth = dateUtc.getMonth();
  const currentYear = dateUtc.getFullYear();
  if (currentMonth < SEPTEMBER) {
    return `${currentYear - 1}${separator}${currentYear}`;
  }
  return `${currentYear}${separator}${currentYear + 1}`;
};

const endYearOfCurrentUnivYear = () => parseInt(currentUnivYear().split('/')[1], 10);

export {
  currentUnivYear,
  getUnivYear,
  endYearOfCurrentUnivYear,
};
