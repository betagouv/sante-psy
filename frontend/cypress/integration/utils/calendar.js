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
  const today = new Date();
  const youngStudentDate = new Date();
  youngStudentDate.setFullYear(youngStudentDate.getFullYear() - 20);

  const dayToSelect = today.getDate();
  const yearToSelect = youngStudentDate.getFullYear();

  cy.get('.react-datepicker__year-select')
    .select(`${yearToSelect}`);

  if (dayToSelect === 1) {
    cy.get('.react-datepicker__navigation--next')
      .click();
  }

  cy.get(`.react-datepicker__day--0${dayToSelect < 10 ? `0${dayToSelect}` : dayToSelect}`)
    .not('.react-datepicker__day--disabled')
    .first()
    .click();

  return youngStudentDate;
};

const selectInvalidDateOfBirth = () => {
  const tooYoungStudentDate = new Date();
  tooYoungStudentDate.setFullYear(tooYoungStudentDate.getFullYear() - 9);

  const yearToSelect = tooYoungStudentDate.getFullYear();

  cy.get('.react-datepicker__year-select')
    .should('not.have.value', `${yearToSelect}`);

  return tooYoungStudentDate;
};

export default { selectNextCalendarDate, selectValidDateOfBirth, selectInvalidDateOfBirth };
