/* eslint-disable func-names */
const rewire = require('rewire')
const loginController = rewire('../controllers/loginController')

describe('loginController', function() {
  describe('generateLoginUrl', () => {
    it('should create a login url to send in a email', function() {
      const generateLoginUrl = loginController.__get__('generateLoginUrl');
      const output = generateLoginUrl("localhost:8080");

      output.should.equal("https://localhost:8080/psychologue/mes-seances");
    })
  })

  describe('generateToken', () => {
    it('should generate a token', function() {
      const generateToken = loginController.__get__('generateToken');
      const output = generateToken("localhost:8080");
      output.length.should.equal(344);
    })

    it('should generate a different token everytime the function is called', function() {
      const generateToken = loginController.__get__('generateToken');
      const output1 = generateToken("localhost:8080");
      const output2 = generateToken("localhost:8080");

      output1.length.should.not.equal(output2);
    })
  })
})
