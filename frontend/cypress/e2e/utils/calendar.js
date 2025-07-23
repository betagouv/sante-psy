const selectNextCalendarDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);

  const dayToSelect = tomorrow.getDate();

  if (dayToSelect === 1) {
    cy.get('.react-datepicker__navigation--next')
      .click();
  }

  cy.get(`.react-datepicker__day--0${dayToSelect < 10 ? `0${dayToSelect}` : dayToSelect}`)
    .not('.react-datepicker__day--disabled')
    .first()
    .click();

  return tomorrow;
};

const selectPreviousCalendarDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const dayToSelect = yesterday.getDate();

  if (dayToSelect === 31) {
    cy.get('.react-datepicker__navigation--previous')
      .click();
  }

  cy.get(`.react-datepicker__day--0${dayToSelect < 10 ? `0${dayToSelect}` : dayToSelect}`)
    .not('.react-datepicker__day--disabled')
    .first()
    .click();

  return yesterday;
};

export default { selectNextCalendarDate, selectPreviousCalendarDate };
