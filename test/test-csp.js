const app = require('../index')
const {request, assert} = require("chai")


describe('CSP test', () => {

  it("Should have restrictions set in csp", async function() {
    const imgConfig = "img-src 'self' https://stats.data.gouv.fr/ data:"
    const srcConfig = "script-src 'self' https://stats.data.gouv.fr"

    return request(app)
    .get('/')
    .redirects(0)
    .then(async (res) => {
      assert.include(res.header['content-security-policy'], imgConfig);
      assert.include(res.header['content-security-policy'], srcConfig);
    })
  });
});