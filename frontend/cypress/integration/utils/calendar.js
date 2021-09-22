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

const selectValidDateOfBirth = () => {
  const youngStudentDate = new Date();
  youngStudentDate.setFullYear(youngStudentDate.getFullYear() - 20);

  // const yearToSelect = youngStudentDate.getFullYear();
};

export default { selectNextCalendarDate, selectValidDateOfBirth };
