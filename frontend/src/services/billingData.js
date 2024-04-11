import { utcDate } from 'services/date';
import allBadges from 'src/utils/badges';

const getFilteredDates = (valuesByDate, month, year) => Object.keys(valuesByDate).filter(date => {
  const appointmentDate = utcDate(date);
  return appointmentDate.getFullYear() === year && appointmentDate.getMonth() === month - 1;
});

const getTotal = (filteredDates, valuesByDate) => filteredDates.reduce((accumulator, date) => {
  const dateValues = valuesByDate[date];
  const totalForDate = Object.values(dateValues).reduce((subTotal, value) => subTotal + value, 0);
  return accumulator + totalForDate;
}, 0);

const getBadgeTotal = (filteredDates, valuesByDate, badge) => filteredDates.reduce((accumulator, date) => {
  const dateValues = valuesByDate[date];
  const valueForBadge = dateValues[badge] || 0; // Récupérer la valeur du badge spécifié ou 0 si non défini
  return accumulator + valueForBadge;
}, 0);

const getTotalForAllBadges = (filteredDates, valuesByDate) => {
  const totals = {};
  Object.keys(allBadges()).forEach(badge => {
    totals[badge] = 0;
  });

  filteredDates.forEach(date => {
    const dateValues = valuesByDate[date];
    Object.keys(dateValues).forEach(badge => {
      totals[badge] += dateValues[badge];
    });
  });

  return totals;
};

export default { getFilteredDates, getTotal, getBadgeTotal, getTotalForAllBadges };
