import chai from 'chai';
import app from '../../index';
import clean from '../helper/clean';
import dbUniversities from '../../db/universities';
import { DossierState } from '../../types/DossierState';
import cookie from '../../utils/cookie';

describe('universitiesController', () => {
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

  it('should return one university', async () => chai.request(app)
        .get(`/api/universities/${university.id}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.body.should.have.all.keys('name', 'siret', 'address', 'postal_code', 'city');
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
