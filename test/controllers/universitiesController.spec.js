import { DossierState } from '../../types/DemarcheSimplifiee';

const chai = require('chai');
const { default: app } = require('../../index');
const { default: clean } = require('../helper/clean');
const { default: cookie } = require('../../utils/cookie');
const { default: dbUniversities } = require('../../db/universities');

describe('universitiesController.spec', () => {
  let university;
  let university2;
  let psy;

  beforeEach(async () => {
    await clean.cleanAllUniversities();

    psy = await clean.insertOnePsy('loginemail@beta.gouv.fr', DossierState.accepte, false, undefined, false);

    university = clean.getOneUniversity('Monster university');
    university2 = clean.getOneUniversity('University of love');
    await dbUniversities.upsertMany([university, university2]);
  });

  it('should return all universities', async () => chai.request(app)
        .get('/api/universities')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.body.should.eql([{
            id: university.id,
            name: university.name,
          }, {
            id: university2.id,
            name: university2.name,
          }]);
        }));

  it('should return one university', async () => chai.request(app)
        .get(`/api/universities/${university.id}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.body.should.eql({
            name: university.name,
            siret: university.siret,
            address: university.address,
            postal_code: university.postal_code,
            city: university.city,
          });
        }));

  it('should NOT return one university if invalid id', async () => chai.request(app)
        .get('/api/universities/invalid_id')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.eql(400);
          res.body.should.eql({ message: 'Vous devez spécifier un identifiant valide.' });
        }));
});
