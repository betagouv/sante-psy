const selectNextCalendarDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);

  const dayToSelect = tomorrow.getDate();

  if (dayToSelect === 1) {
    cy.get('.react-datepicker__navigation--next')
      .click();
  }

  cy.get(`.react-datepicker__day--0${dayToSelect < 10 ? `0${dayToSelect}` : dayToSelect}`)
    .last()
    .click();

  return tomorrow;
};

export default { selectNextCalendarDate };
