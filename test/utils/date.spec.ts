import { assert } from 'chai';
import date from '../../utils/date';

describe('date', () => {
  describe('parseForm', () => {
    it('should parse a DD/MM/YYYY to a Date', async () => {
      const testDate = '25/12/1995';
      const datetime = date.parseForm(testDate);
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
      const ddMMYYYY = date.toFormatDDMMYYYY(testDate);
      ddMMYYYY.should.be.equal('25/12/1995');
    });

    it('should return null if Date is null', async () => {
      const output = date.toFormatDDMMYYYY(null);
      assert.isNull(output);
    });
  });
});
