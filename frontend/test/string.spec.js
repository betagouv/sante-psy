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
