const { assert } = require('chai');
const date = require('../utils/date');

describe('date', () => {
  describe('parseDateForm', () => {
    it('should parse a DD/MM/YYYY to a Date', async () => {
      const testDate = '25/12/1995';
      const datetime = date.parseDateForm(testDate);
      datetime.getFullYear().should.be.equal(1995);
      datetime.getMonth().should.be.equal(11);
      datetime.getDate().should.be.equal(25);
    });
  });

  describe('formatFrenchDate', () => {
    it('should parse a DD/MM/YYYY to a Date', async () => {
      const testDate = new Date('1995-12-25');
      const longFrenchFormat = date.formatFrenchDate(testDate);
      longFrenchFormat.should.be.equal('lundi 25 décembre 1995');
    });
  });

  describe('toFormatDDMMYYYY', () => {
    it('should return a Date to format DD/MM/YYYY', async () => {
      const testDate = new Date('1995-12-25');
      console.log('testDate', testDate);
      const ddMMYYYY = date.toFormatDDMMYYYY(testDate);
      ddMMYYYY.should.be.equal('25/12/1995');
    });

    it('should return null if Date is null', async () => {
      const output = date.toFormatDDMMYYYY(null);
      assert.isNull(output);
    });
  });

  describe('getFrenchMonthName', () => {
    it('should return the french name for a month number', async () => {
      const janvier = date.getFrenchMonthName(1);
      janvier.should.be.equal('janvier');
      const février = date.getFrenchMonthName(2);
      février.should.be.equal('février');
      const mars = date.getFrenchMonthName(3);
      mars.should.be.equal('mars');
      const avril = date.getFrenchMonthName(4);
      avril.should.be.equal('avril');
      const mai = date.getFrenchMonthName(5);
      mai.should.be.equal('mai');
      const juin = date.getFrenchMonthName(6);
      juin.should.be.equal('juin');
      const juillet = date.getFrenchMonthName(7);
      juillet.should.be.equal('juillet');
      const août = date.getFrenchMonthName(8);
      août.should.be.equal('août');
      const septembre = date.getFrenchMonthName(9);
      septembre.should.be.equal('septembre');
      const octobre = date.getFrenchMonthName(10);
      octobre.should.be.equal('octobre');
      const novembre = date.getFrenchMonthName(11);
      novembre.should.be.equal('novembre');
      const decembre = date.getFrenchMonthName(12);
      decembre.should.be.equal('décembre');
      const error = date.getFrenchMonthName(13);
      error.should.be.equal('Erreur');
    });
  });

  describe('getLastMonthAndYear', () => {
    it('should getLastMonthAndYear, normal case', () => {
      const { lastMonth, year } = date.getLastMonthAndYear(new Date('2021-03-04'));
      lastMonth.should.equal(2);
      year.should.equal(2021);
    });

    it('should getLastMonthAndYear, january case', () => {
      const { lastMonth, year } = date.getLastMonthAndYear(new Date('2021-01-04'));
      lastMonth.should.equal(12);
      year.should.equal(2020);
    });
  });

  describe('isSameMonth', () => {
    it('should return true if same month and year', () => {
      const date1 = new Date('2021-05-04');
      const date2 = new Date('2021-05-02');
      date.isSameMonth(date1, date2).should.be.true;
    });

    it('should return false if same month but not same year', () => {
      const date1 = new Date('2021-05-04');
      const date2 = new Date('2022-05-02');
      date.isSameMonth(date1, date2).should.be.false;
    });

    it('should return false if same year but not same month', () => {
      const date1 = new Date('2021-05-04');
      const date2 = new Date('2021-02-04');
      date.isSameMonth(date1, date2).should.be.false;
    });
  });
});
