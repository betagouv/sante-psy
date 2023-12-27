import { utcDate } from 'services/date';

const getFilteredDates = (valuesByDate, month, year) => Object.keys(valuesByDate).filter(date => {
  const appointmentDate = utcDate(date);
  return appointmentDate.getFullYear() === year
        && appointmentDate.getMonth() === month - 1;
});

const getTotal = (filteredDates, valuesByDate) => filteredDates.reduce((accumulator, date) => accumulator + valuesByDate[date], 0);

export default { getFilteredDates, getTotal };
