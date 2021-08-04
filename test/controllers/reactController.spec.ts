import chai from 'chai';
import app from '../../index';

describe('reactController', async () => {
  describe('No cache headers', () => {
    it('should return no cache headers when asking root app', async () => chai.request(app)
      .get('/')
      .then(async (res) => {
        res.header['cache-control'].should.equal('no-cache, no-store, must-revalidate');
        res.header.pragma.should.equal('no-cache');
        res.header.expires.should.equal('0');
      }));

    it('should return no cache headers when asking any pages', async () => chai.request(app)
    .get('/psychologue/mes-seances')
    .then(async (res) => {
      res.header['cache-control'].should.equal('no-cache, no-store, must-revalidate');
      res.header.pragma.should.equal('no-cache');
      res.header.expires.should.equal('0');
    }));
  });
});
