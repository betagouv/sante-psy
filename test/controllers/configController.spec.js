const chai = require('chai');
const app = require('../../index');
const clean = require('../helper/clean');
const dbUniversities = require('../../db/universities');

describe('configController', () => {
  beforeEach(async () => {
    await clean.cleanAllUniversities();
    await dbUniversities.saveUniversities([{
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
  it('should return basic config info', async () => chai.request(app)
        .get('/api/config')
        .then(async (res) => {
          res.body.should.eql({
            announcement: '(Docker-compose variable) Very important announcement.',
            appName: 'Santé Psy Étudiant',
            contactEmail: 'contact-santepsyetudiants@beta.gouv.fr',
            dateOfBirthDeploymentDate: '20/04/2021',
            demarchesSimplifieesUrl: 'https://demarches-simplifiees.fr/',
            satistics: {
              base: 'https://stats.santepsyetudiant.beta.gouv.fr',
              dashboard: '/public/dashboard/a3834fd4-aa00-4ee2-a119-11dd2156e082',
            },
            sessionDuration: '2',
            universities: [{
              id: '18380a4c-51e1-4dcb-ad9a-3d8c2e84d1ff',
              name: 'Monster university',
              emailSSU: 'monster@ssu.fr',
              emailUniversity: 'monster@university.fr',
            }, {
              id: 'abaa66b8-1d78-4a61-9805-3e5e353db0af',
              name: 'University of love',
              emailSSU: 'love@ssu.fr',
              emailUniversity: 'love@university.fr',
            }],
          });
        }));
});
