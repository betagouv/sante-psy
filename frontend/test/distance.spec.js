const { expect } = require('chai');
const distance = require('../src/services/distance');

const LONGITUDE_PARIS = 2.3488;
const LATITUDE_PARIS = 48.85341;
const LONGITUDE_MARSEILLE = 5.38107;
const LATITUDE_MARSEILLE = 43.29695;

describe('Distance', () => {
  it('Should return distance between 2 points', () => {
    const result = distance.distanceKm(LATITUDE_PARIS, LONGITUDE_PARIS, LATITUDE_MARSEILLE, LONGITUDE_MARSEILLE);
    expect(result).to.be.greaterThan(0);
    expect(result).to.be.lessThan(2000);
  });

  it('Should return 0 if 2 same points', () => {
    expect(distance.distanceKm(LATITUDE_PARIS, LONGITUDE_PARIS, LATITUDE_PARIS, LONGITUDE_PARIS)).to.equal(0);
  });

  it('Should return max distance if one value is empty', () => {
    expect(distance.distanceKm('', '', LATITUDE_PARIS, LONGITUDE_PARIS)).to.equal(2000);
    expect(distance.distanceKm(LATITUDE_PARIS, LONGITUDE_PARIS, '', '')).to.equal(2000);
  });

  it('Should return max distance if one value is null', () => {
    expect(distance.distanceKm(null, null, LATITUDE_PARIS, LONGITUDE_PARIS)).to.equal(2000);
    expect(distance.distanceKm(LATITUDE_PARIS, LONGITUDE_PARIS, null, null)).to.equal(2000);
  });

  it('Should return max distance if one value is undefined', () => {
    expect(distance.distanceKm(undefined, undefined, LATITUDE_PARIS, LONGITUDE_PARIS)).to.equal(2000);
    expect(distance.distanceKm(LATITUDE_PARIS, LONGITUDE_PARIS, undefined, undefined)).to.equal(2000);
  });
});
