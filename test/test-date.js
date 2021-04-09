const date = require('../utils/date');
const assert = require('chai').assert;

describe('date', () => {

  describe("parseDateForm", () => {
    it('should parse a DD/MM/YYYY to a Date', async () => {
      const testDate = "25/12/1995"
      const datetime = date.parseDateForm(testDate);
      datetime.getTime().should.be.equal(new Date("1995-12-25").getTime());
    });
  })

  describe("formatFrenchDate", () => {
    it('should parse a DD/MM/YYYY to a Date', async () => {
      const testDate = new Date("1995-12-25");
      const longFrenchFormat = date.formatFrenchDate(testDate);
      longFrenchFormat.should.be.equal("lundi 25 décembre 1995");
    });
  })

  describe("toFormatDDMMYYYY", () => {
    it('should return a Date to format DD/MM/YYYY', async () => {
      const testDate = new Date("1995-12-25");
      console.log("testDate", testDate)
      const ddMMYYYY = date.toFormatDDMMYYYY(testDate);
      ddMMYYYY.should.be.equal("25/12/1995");
    });

    it('should return null if Date is null', async () => {
      const output = date.toFormatDDMMYYYY(null);
      assert(output === null)
    });
  });

  describe("toFormatMMDDYYYY", () => {
    it('should return a Date to format MM-DD-YYYY', async () => {
      const testDate = new Date("1995-12-25");
      const ddMMYYYY = date.toFormatMMDDYYYY(testDate);
      ddMMYYYY.should.be.equal("12-25-1995");
    });
  });

  describe('getFrenchMonthName', () => {
    it('should return the french name for a month number', async () => {
      const janvier = date.getFrenchMonthName(1);
      janvier.should.be.equal("janvier");
      const février = date.getFrenchMonthName(2)
      février.should.be.equal("février");
      const mars = date.getFrenchMonthName(3)
      mars.should.be.equal("mars");
      const avril = date.getFrenchMonthName(4)
      avril.should.be.equal("avril");
      const mai = date.getFrenchMonthName(5)
      mai.should.be.equal("mai");
      const juin = date.getFrenchMonthName(6)
      juin.should.be.equal("juin");
      const juillet = date.getFrenchMonthName(7)
      juillet.should.be.equal("juillet");
      const août = date.getFrenchMonthName(8)
      août.should.be.equal("août");
      const septembre = date.getFrenchMonthName(9)
      septembre.should.be.equal("septembre");
      const octobre = date.getFrenchMonthName(10)
      octobre.should.be.equal("octobre");
      const novembre = date.getFrenchMonthName(11)
      novembre.should.be.equal("novembre");
      const decembre = date.getFrenchMonthName(12)
      decembre.should.be.equal("décembre");
      const error = date.getFrenchMonthName(13)
      error.should.be.equal("Erreur");
    });
  });
});