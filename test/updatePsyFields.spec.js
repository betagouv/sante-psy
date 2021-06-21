const { expect } = require('chai');
const updatePsyFields = require('../services/updatePsyFields');

describe('addFrenchLanguageIfMissing', () => {
  it('should return Français if input is undefined', async () => {
    const result = updatePsyFields.addFrenchLanguageIfMissing(undefined);
    expect(result).to.eql('Français');
  });

  it('should return Français if input is null', async () => {
    const result = updatePsyFields.addFrenchLanguageIfMissing(null);
    expect(result).to.eql('Français');
  });

  it('should return Français if input is empty', async () => {
    const result = updatePsyFields.addFrenchLanguageIfMissing('');
    expect(result).to.eql('Français');
  });

  it('should return Français if input contains only spaces', async () => {
    const result = updatePsyFields.addFrenchLanguageIfMissing('  ');
    expect(result).to.eql('Français');
  });

  it('should add Français if input does not contains it', async () => {
    const result = updatePsyFields.addFrenchLanguageIfMissing('Anglais');
    expect(result).to.eql('Français, Anglais');
  });

  it('should not add Français if input contains it', async () => {
    const result = updatePsyFields.addFrenchLanguageIfMissing('Français, Anglais');
    expect(result).to.eql('Français, Anglais');
  });

  it('should not add Français if input contains it (lower case)', async () => {
    const result = updatePsyFields.addFrenchLanguageIfMissing('français, anglais');
    expect(result).to.eql('français, anglais');
  });

  it('should not add Français if input contains it (no special char)', async () => {
    const result = updatePsyFields.addFrenchLanguageIfMissing('francais, anglais');
    expect(result).to.eql('francais, anglais');
  });

  it('should not add Français if input contains it (no specific order)', async () => {
    const result = updatePsyFields.addFrenchLanguageIfMissing('Espagnol Francais Anglais');
    expect(result).to.eql('Espagnol Francais Anglais');
  });
});
