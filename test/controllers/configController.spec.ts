import chai from 'chai';
import app from '../../index';

describe('configController', () => {
  it('should return basic config info', async () => chai.request(app)
        .get('/api/config')
        .then(async (res) => {
          res.body.should.eql({
            announcement: '(Docker-compose variable) Very important announcement.',
            appName: 'Santé Psy Étudiant',
            contactEmail: 'contact-santepsyetudiants@beta.gouv.fr',
            dateOfBirthDeploymentDate: '20/04/2021',
            demarchesSimplifieesUrl: 'https://demarches-simplifiees.fr/',
            statistics: {
              base: 'https://stats.santepsyetudiant.beta.gouv.fr',
              dashboard: '/public/dashboard/a3834fd4-aa00-4ee2-a119-11dd2156e082',
            },
            sessionDuration: '2',
          });
        }));
});
