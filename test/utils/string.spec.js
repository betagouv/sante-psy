const { default: string } = require('../../utils/string');
const { expect } = require('chai');

describe('String utils', () => {
  describe('Are similar', () => {
    const tests = [
      { value1: 'hello you', value2: 'hello you', result: true },
      { value1: 'HELLO you', value2: 'HeLlo yOu', result: true },
      { value1: 'heL- l-o yOu', value2: 'hello you', result: true },
      { value1: 'HELLOYOU', value2: 'hello you  ', result: true },
      { value1: 'hello_you', value2: 'hello you  ', result: false },
      { value1: 'hello me', value2: 'hello you  ', result: false },
      { value1: 'Léa', value2: 'lea', result: true },
      { value1: 'Léa', value2: 'Lèa', result: true },
      { value1: 'Léa', value2: 'Làa', result: false },
      { value1: 'Loùloù', value2: 'LOULOU', result: true },
    ];

    tests.forEach((test) => {
      it(`Should return ${test.result} for ${test.value1} and ${test.value2}`, () => {
        const result = string.areSimilar(test.value1, test.value2);
        result.should.equals(test.result);
      });
    });
  });

  describe('Prefix URL', () => {
    it('Should return undefined if value invalid', () => {
      expect(string.prefixUrl(null)).to.be.undefined;
      expect(string.prefixUrl('')).to.be.undefined;
      expect(string.prefixUrl(' ')).to.be.undefined;
      expect(string.prefixUrl(undefined)).to.be.undefined;
    });

    it('Should prefix url by https protocol if not there', () => {
      string.prefixUrl('yakalelo.com').should.equals('http://yakalelo.com');
      string.prefixUrl('www.yakalelo.com').should.equals('http://www.yakalelo.com');
      string.prefixUrl('http.yakalelo.com').should.equals('http://http.yakalelo.com');
      string.prefixUrl('http:yakalelo.com').should.equals('http://http:yakalelo.com');
      string.prefixUrl('http:/yakalelo.com').should.equals('http://http:/yakalelo.com');
    });

    it('Should do nothing if http protocol already there', () => {
      string.prefixUrl('http://www.yakalelo.com').should.equals('http://www.yakalelo.com');
      string.prefixUrl('http:///www.yakalelo.com').should.equals('http:///www.yakalelo.com');
    });

    it('Should do nothing if https protocol already there', () => {
      string.prefixUrl('https://www.yakalelo.com').should.equals('https://www.yakalelo.com');
    });
  });
});
