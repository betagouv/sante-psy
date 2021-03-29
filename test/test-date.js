const date = require('../utils/date');

describe('date', () => {
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