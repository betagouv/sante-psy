require('chai').should();
const search = require('../src/services/search');

describe('Search', () => {
  describe('matchFilter', () => {
    const tests = [
      { value: 'Dupont', filter: 'dupont', result: true },
      { value: 'Dupont', filter: '  dupont', result: true },
      { value: 'Dupont', filter: 'Dupon', result: true },
      { value: 'Dupont', filter: ' ', result: true },
      { value: 'Dupont', filter: 'Martin', result: false },
      { value: 'Dupont', filter: 'Dupond', result: false },
    ];

    tests.forEach(test => {
      it(`Should return ${test.result} for ${test.value} and ${test.filter}`, () => {
        const result = search.matchFilter(test.value, test.filter);
        result.should.equals(test.result);
      });
    });
  });

  describe('matchDepartment', () => {
    const tests = [
      { address: '9 boulevard des capucines 75002 paris', filter: '75', result: true },
      { address: '9 boulevard des capucines', filter: '75', result: false },
      { address: '13 boulevard des capucines 75002 paris', filter: '13', result: false },
      { address: '25 rue du Vieux Pont 92000 Nanterre', filter: '20', result: false },
    ];

    tests.forEach(test => {
      it(`Should return ${test.result} for ${test.address} and filter ${test.filter}`, () => {
        const result = search.matchDepartment(test.address, test.filter);
        result.should.equals(test.result);
      });
    });
  });

  describe('matchZipCodeOrCity', () => {
    const tests = [
      { address: 'rue du faubourg saint honoré 75008 paris', filter: '75008', result: true },
      { address: 'rue du faubourg saint honoré 75008 paris', filter: 'paris', result: true },
      { address: 'rue du faubourg saint honoré 75008 paris', filter: 'PARIS', result: true },
      { address: 'rue du faubourg saint honoré 75008 paris', filter: '75008 PARIS', result: true },
      { address: 'rue du faubourg saint honoré 75008 paris', filter: ' pari', result: true },
      { address: 'rue du faubourg saint honoré 75008 paris', filter: 'Marseille', result: false },
      { address: 'rue du faubourg saint honoré 75008 paris', filter: 'faubourg', result: false },
    ];

    tests.forEach(test => {
      it(`Should return ${test.result} for ${test.address} and filter ${test.filter}`, () => {
        const result = search.matchZipCodeOrCity(test.address, test.filter);
        result.should.equals(test.result);
      });
    });
  });

  describe('matchName', () => {
    const tests = [
      { psychologist: { firstNames: 'Jean Jacques', lastName: 'Goldman' }, filter: 'jean', result: true },
      { psychologist: { firstNames: 'Jean Jacques', lastName: 'Goldman' }, filter: 'goldman', result: true },
      { psychologist: { firstNames: 'Jean Jacques', lastName: 'Goldman' }, filter: 'jacques', result: true },
      { psychologist: { firstNames: 'Jean Jacques', lastName: 'Goldman' }, filter: 'jean goldman', result: true },
      { psychologist: { firstNames: 'Jean Jacques', lastName: 'Goldman' }, filter: 'jacques goldman', result: true },
      { psychologist: { firstNames: 'Jean Jacques', lastName: 'Goldman' }, filter: 'jean jacques goldman', result: true },
      { psychologist: { firstNames: 'Jean Jacques', lastName: 'Goldman' }, filter: 'goldman jean', result: true },
      { psychologist: { firstNames: 'Jean Jacques', lastName: 'Goldman' }, filter: 'goldman jacques', result: true },
      { psychologist: { firstNames: 'Jean Jacques', lastName: 'Goldman' }, filter: 'j j g', result: true },
      { psychologist: { firstNames: 'Jean Jacques', lastName: 'Goldman' }, filter: 'j g', result: true },
      { psychologist: { firstNames: 'Jean Jacques', lastName: 'Goldman' }, filter: 'g j j', result: true },
      { psychologist: { firstNames: 'Jean Jacques', lastName: 'Goldman' }, filter: 'g j', result: true },
      { psychologist: { firstNames: 'Jean Jacques', lastName: 'Goldman' }, filter: 'marie', result: false },
      { psychologist: { firstNames: 'Jean Jacques', lastName: 'Goldman' }, filter: 'jeanne', result: false },
      { psychologist: { firstNames: 'Jean Jacques', lastName: 'Goldman' }, filter: 'Goldo', result: false },
    ];

    tests.forEach(test => {
      it(`Should return ${test.result} for ${test.psychologist} and filter ${test.filter}`, () => {
        const result = search.matchName(test.psychologist, test.filter);
        result.should.equals(test.result);
      });
    });
  });
});
