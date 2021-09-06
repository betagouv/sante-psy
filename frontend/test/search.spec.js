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
      { address: '13 boulevard des capucines 75002 paris;25 rue du Vieux Pont 92000 Nanterre', filter: '75', result: true },
      { address: '13 boulevard des capucines 75002 paris ; 25 rue du Vieux Pont 92000 Nanterre', filter: '92', result: true },
      { address: '13 boulevard des capucines 75002 paris ; 25 rue du Vieux Pont 92000 Nanterre', filter: '20', result: false },
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
      { address: 'rue du faubourg saint honoré 75008 paris;71 Avenue Jean Jaurès 93500 Pantin ', filter: '75008', result: true },
      { address: 'rue du faubourg saint honoré 75008 paris ; 71 Avenue Jean Jaurès 93500 Pantin ', filter: '93500', result: true },
      { address: 'rue du faubourg saint honoré 75008 paris; 71 Avenue Jean Jaurès 93500 Pantin ', filter: 'pari', result: true },
      { address: 'rue du faubourg saint honoré 75008 paris ;71 Avenue Jean Jaurès 93500 Pantin ', filter: 'panti', result: true },
      { address: 'rue du faubourg saint honoré 75008 paris ; 71 Avenue Jean Jaurès 93500 Pantin ', filter: 'jean', result: false },
      { address: 'rue du faubourg saint honoré 75008 paris ; 71 Avenue Jean Jaurès 93500 Pantin ', filter: 'faubourg', result: false },
    ];

    tests.forEach(test => {
      it(`Should return ${test.result} for ${test.address} and filter ${test.filter}`, () => {
        const result = search.matchZipCodeOrCity(test.address, test.filter);
        result.should.equals(test.result);
      });
    });
  });
});
