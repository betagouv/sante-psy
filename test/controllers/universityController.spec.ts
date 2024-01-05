import chai from 'chai';
import app from '../../index';
import clean from '../helper/clean';
import create from '../helper/create';
import dbUniversities from '../../db/universities';
import cookie from '../../utils/cookie';

describe('universitiesController', () => {
  let university;
  let university2;
  let psy;

  beforeEach(async () => {
    await clean.universities();

    psy = await create.insertOnePsy({ personalEmail: 'loginemail@beta.gouv.fr' }, false);

    university = create.getOneUniversity('Monster university');
    university2 = create.getOneUniversity('University of love');
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
            billingAddress: university.billingAddress,
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
