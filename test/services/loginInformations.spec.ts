import loginInformations from '../../services/loginInformations';

describe('loginInformations', async () => {
  describe('generatePsyLoginUrl', () => {
    it('should create a login url to send in a email', () => {
      loginInformations.generatePsyLoginUrl().should.equal('http://localhost:8080/psychologue/login');
    });
  });

  describe('generateToken', () => {
    it('should generate a token', () => {
      loginInformations.generateToken().length.should.equal(128);
    });

    it('should generate a different token everytime the function is called', () => {
      const output1 = loginInformations.generateToken();
      const output2 = loginInformations.generateToken();

      output1.length.should.not.equal(output2);
    });
  });
});
