/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const string = require('../src/services/string');

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

describe('Display statistics', () => {
  it('Should return undefined if value invalid', () => {
    string.displayStatistic('1').should.equals('1');
    string.displayStatistic('12').should.equals('12');
    string.displayStatistic('123').should.equals('120');
    string.displayStatistic('1234').should.equals('1 200');
    string.displayStatistic('12345').should.equals('12 000');
    string.displayStatistic('123456').should.equals('120 000');
    string.displayStatistic('1234567').should.equals('1 200 000');
    string.displayStatistic('12345678').should.equals('12 000 000');
  });
});
