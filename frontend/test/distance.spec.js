const { expect } = require('chai');
const distance = require('../src/services/distance');

const LONGITUDE_PARIS = 2.3488;
const LATITUDE_PARIS = 48.85341;
const LONGITUDE_MARSEILLE = 5.38107;
const LATITUDE_MARSEILLE = 43.29695;
const LONGITUDE_NICE = 7.26608;
const LATITUDE_NICE = 43.70313;

describe('Distance', () => {
  describe('comparator', () => {
    const userPosition = { longitude: LONGITUDE_NICE, latitude: LATITUDE_NICE };

    it('Nice is further away from Paris than Marseille', () => {
      const psyA = { longitude: LONGITUDE_PARIS, latitude: LATITUDE_PARIS };
      const psyB = { longitude: LONGITUDE_MARSEILLE, latitude: LATITUDE_MARSEILLE };

      const result = distance.comparator(psyA, psyB, userPosition);
      expect(result).to.be.greaterThan(0);
    });

    it('Nice is closer from Marseille than Paris', () => {
      const psyA = { longitude: LONGITUDE_MARSEILLE, latitude: LATITUDE_MARSEILLE };
      const psyB = { longitude: LONGITUDE_PARIS, latitude: LATITUDE_PARIS };

      const result = distance.comparator(psyA, psyB, userPosition);
      expect(result).to.be.lessThan(0);
    });

    it('Nice is further away from Marseille than unknown location', () => {
      const psyA = { };
      const psyB = { longitude: LONGITUDE_MARSEILLE, latitude: LATITUDE_MARSEILLE };

      const result = distance.comparator(psyA, psyB, userPosition);
      expect(result).to.be.greaterThan(0);
    });

    it('Nice is closer from unknown location than Marseille', () => {
      const psyA = { longitude: LONGITUDE_MARSEILLE, latitude: LATITUDE_MARSEILLE };
      const psyB = { };

      const result = distance.comparator(psyA, psyB, userPosition);
      expect(result).to.be.lessThan(0);
    });

    it('Nice is equaly distant from unknown location than unknown location', () => {
      const psyA = {};
      const psyB = { };

      const result = distance.comparator(psyA, psyB, userPosition);
      expect(result).to.equal(0);
    });

    it('User location null should return 0', () => {
      const psyA = { longitude: LONGITUDE_MARSEILLE, latitude: LATITUDE_MARSEILLE };
      const psyB = { longitude: LONGITUDE_PARIS, latitude: LATITUDE_PARIS };

      const result = distance.comparator(psyA, psyB, null);
      expect(result).to.equal(0);
    });

    it('User location undefined should return 0', () => {
      const psyA = { longitude: LONGITUDE_MARSEILLE, latitude: LATITUDE_MARSEILLE };
      const psyB = { longitude: LONGITUDE_PARIS, latitude: LATITUDE_PARIS };

      const result = distance.comparator(psyA, psyB, undefined);
      expect(result).to.equal(0);
    });

    it('User location empty should return 0', () => {
      const psyA = { longitude: LONGITUDE_MARSEILLE, latitude: LATITUDE_MARSEILLE };
      const psyB = { longitude: LONGITUDE_PARIS, latitude: LATITUDE_PARIS };

      const result = distance.comparator(psyA, psyB, {});
      expect(result).to.equal(0);
    });
  });
});
