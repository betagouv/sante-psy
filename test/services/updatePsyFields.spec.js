const { default: updatePsyFields } = require('../../services/updatePsyFields');

describe('addFrenchLanguageIfMissing', () => {
  it('should add french if missing with one language', async () => {
    updatePsyFields.addFrenchLanguageIfMissing('espagnol').should.equal('Français, espagnol');
  });

  it('should add french if nothing there', async () => {
    updatePsyFields.addFrenchLanguageIfMissing('').should.equal('Français');
  });

  it('should add french if empty spaces for languages', async () => {
    updatePsyFields.addFrenchLanguageIfMissing('    ').should.equal('Français');
  });

  it('should not add french if already there', async () => {
    updatePsyFields.addFrenchLanguageIfMissing('français, italien').should.equal('français, italien');
  });

  it("should not add french if 'francais' is there", async () => {
    updatePsyFields.addFrenchLanguageIfMissing('francais').should.equal('francais');
  });

  it('should not add french (capitalized) if already there', async () => {
    updatePsyFields.addFrenchLanguageIfMissing('Français et espagnol').should.equal('Français et espagnol');
  });
});
