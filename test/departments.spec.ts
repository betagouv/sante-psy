import department from '../utils/department';

describe('department - getNumberFromString', () => {
  it('should return departement number from departement and number', async () => {
    const departementNumber = '55';
    const departementString = `${departementNumber} - Indre-et-Loire`;
    const output = department.getNumberFromString(departementString);

    output.should.equal(departementNumber);
  });
});
