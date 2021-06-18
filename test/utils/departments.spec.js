const { getDepartementNumberFromString } = require('../../utils/department');

describe('getDepartementNumberFromString', () => {
  it('should return departement number from departement and number', async () => {
    const departementNumber = '55';
    const departementString = `${departementNumber} - Indre-et-Loire`;
    const output = getDepartementNumberFromString(departementString);

    output.should.equal(departementNumber);
  });
});
