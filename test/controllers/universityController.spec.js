const chai = require('chai');
const app = require('../../index');
const { default: clean } = require('../helper/clean');
const dbUniversities = require('../../db/universities');

describe('universityController.spec', () => {
  beforeEach(async () => {
    await clean.cleanAllUniversities();
    await dbUniversities.upsertMany([{
      id: '18380a4c-51e1-4dcb-ad9a-3d8c2e84d1ff',
      name: 'Monster university',
      emailSSU: 'monster@ssu.fr',
      emailUniversity: 'monster@university.fr',
    }, {
      id: 'abaa66b8-1d78-4a61-9805-3e5e353db0af',
      name: 'University of love',
      emailSSU: 'love@ssu.fr',
      emailUniversity: 'love@university.fr',
    },
    ]);
  });

  it('should return all universities', async () => chai.request(app)
        .get('/api/university')
        .then(async (res) => {
          res.body.should.eql([{
            id: '18380a4c-51e1-4dcb-ad9a-3d8c2e84d1ff',
            name: 'Monster university',
            emailSSU: 'monster@ssu.fr',
            emailUniversity: 'monster@university.fr',
          }, {
            id: 'abaa66b8-1d78-4a61-9805-3e5e353db0af',
            name: 'University of love',
            emailSSU: 'love@ssu.fr',
            emailUniversity: 'love@university.fr',
          }]);
        }));
});
