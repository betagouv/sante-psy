import chai, { expect } from 'chai';
import sinon from 'sinon';
import app from '../../index';
import clean from '../helper/clean';
import create from '../helper/create';
import cookie from '../../utils/cookie';
import date from '../../utils/date';
import dbPatients from '../../db/patients';
import dbAppointments from '../../db/appointments';
import dbPsychologists from '../../db/psychologists';

const doctorName = 'doctorName';
const dateOfBirth = '20/01/1980';
const gender = 'female';

const makePatient = async (psychologistId, INE = '12345678901') => {
  const psy = create.getOnePsy();
  psy.dossierNumber = psychologistId;
  await dbPsychologists.upsertMany([psy]);
  // Insert an appointment and a patient
  const patient = await dbPatients.insert(
    'Ada',
    'Lovelace',
    date.parseForm(dateOfBirth),
    gender,
    INE,
    false,
    '42',
    false,
    psychologistId,
    doctorName,
  );
  // Check patient is inserted
  const createdPatient = await dbPatients.getById(patient.id, psychologistId);
  chai.assert.exists(createdPatient);
  return patient;
};

describe('patientsController', () => {
  describe('get all patients', () => {
    beforeEach(async (done) => {
      done();
    });

    afterEach(async () => {
      await clean.patients();
      return Promise.resolve();
    });

    it('should get all patients', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };
      const myPatient = await makePatient(psy.dossierNumber);
      await dbAppointments.insert(new Date('2021-04-01'), myPatient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date(), myPatient.id, psy.dossierNumber);

      return chai.request(app)
        .get('/api/patients')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          expect(res.status).to.equal(200);
          res.status.should.equal(200);

          res.body.length.should.equal(1);
          res.body[0].firstNames.should.equal(myPatient.firstNames);
          res.body[0].lastName.should.equal(myPatient.lastName);
          res.body[0].id.should.equal(myPatient.id);
          res.body[0].institutionName.should.equal(myPatient.institutionName);
          res.body[0].doctorName.should.equal(myPatient.doctorName);
          res.body[0].dateOfBirth.should.equal(myPatient.dateOfBirth.toISOString());
          res.body[0].appointmentsCount.should.equal('2');
          res.body[0].appointmentsYearCount.should.equal('1');

          return Promise.resolve();
        });
    });

    it('should get all patients with appointments count and without deleted appointments', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };
      const anotherPsy = {
        dossierNumber: '5b42d12f-8328-4545-8da3-11250f876146',
        email: 'other@valid.org',
      };
      const myPatient = await makePatient(psy.dossierNumber, '12345698563');
      const myPatientOtherPsy = await makePatient(anotherPsy.dossierNumber, '12345698563');

      await dbAppointments.insert(new Date('2021-04-01'), myPatient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date(), myPatient.id, psy.dossierNumber);
      const toDelete = await dbAppointments.insert(new Date(), myPatient.id, psy.dossierNumber);
      dbAppointments.delete(toDelete.id, psy.dossierNumber);

      await dbAppointments.insert(new Date(), myPatientOtherPsy.id, anotherPsy.dossierNumber);
      await dbAppointments.insert(new Date(), myPatientOtherPsy.id, anotherPsy.dossierNumber);

      return chai.request(app)
        .get('/api/patients')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          expect(res.status).to.equal(200);
          res.status.should.equal(200);

          res.body.length.should.equal(1);
          res.body[0].firstNames.should.equal(myPatient.firstNames);
          res.body[0].lastName.should.equal(myPatient.lastName);
          res.body[0].id.should.equal(myPatient.id);
          res.body[0].institutionName.should.equal(myPatient.institutionName);
          res.body[0].doctorName.should.equal(myPatient.doctorName);
          res.body[0].dateOfBirth.should.equal(myPatient.dateOfBirth.toISOString());
          res.body[0].appointmentsCount.should.equal('4');
          res.body[0].appointmentsYearCount.should.equal('3');

          return Promise.resolve();
        });
    });

    it('should get patient right count for current schoolyear', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };
      const myPatient = await makePatient(psy.dossierNumber);

      const getCurrentSchoolYear = () => {
        const now = new Date();
        const year = now.getFullYear();
        const septemberFirst = new Date(year, 8, 1);

        if (now < septemberFirst) {
          return year - 1;
        }
        return year;
      };

      const currentSchoolYear = getCurrentSchoolYear();

      // former school year
      await dbAppointments.insert(new Date(`${currentSchoolYear - 1}-11-01`), myPatient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date(`${currentSchoolYear - 1}-12-02`), myPatient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date(`${currentSchoolYear}-02-04`), myPatient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date(`${currentSchoolYear}-05-06`), myPatient.id, psy.dossierNumber);

      // current school year
      await dbAppointments.insert(new Date(`${currentSchoolYear}-09-01`), myPatient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date(`${currentSchoolYear}-10-01`), myPatient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date(`${currentSchoolYear}-11-01`), myPatient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date(`${currentSchoolYear}-12-01`), myPatient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date(`${currentSchoolYear + 1}-04-01`), myPatient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date(`${currentSchoolYear + 1}-05-01`), myPatient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date(`${currentSchoolYear + 1}-07-01`), myPatient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date(`${currentSchoolYear + 1}-07-05`), myPatient.id, psy.dossierNumber);
      await dbAppointments.insert(new Date(`${currentSchoolYear + 1}-07-20`), myPatient.id, psy.dossierNumber);

      return chai.request(app)
        .get('/api/patients')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          expect(res.status).to.equal(200);
          res.status.should.equal(200);

          res.body.length.should.equal(1);
          res.body[0].firstNames.should.equal(myPatient.firstNames);
          res.body[0].lastName.should.equal(myPatient.lastName);
          res.body[0].id.should.equal(myPatient.id);
          res.body[0].institutionName.should.equal(myPatient.institutionName);
          res.body[0].doctorName.should.equal(myPatient.doctorName);
          res.body[0].dateOfBirth.should.equal(myPatient.dateOfBirth.toISOString());
          res.body[0].gender.should.equal('female');
          res.body[0].appointmentsCount.should.equal('13');
          res.body[0].appointmentsYearCount.should.equal('9');

          return Promise.resolve();
        });
    });
  });

  describe('create patient', () => {
    beforeEach(async (done) => {
      done();
    });

    afterEach(async () => {
      await clean.patients();
      return Promise.resolve();
    });

    it('should create patient', async () => {
      const psy = await create.insertOnePsy();

      return chai.request(app)
        .post('/api/patients')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          lastName: 'Lovelace',
          firstNames: 'Ada',
          INE: '12345678901',
          isINESvalid: false,
          institutionName: 'test',
          isStudentStatusVerified: undefined,
          dateOfBirth,
          gender,
        })
        .then(async (res) => {
          res.status.should.equal(200);
          res.body.message.should.equal(
            "L'étudiant Ada Lovelace a bien été créé. Vous pourrez renseigner les champs manquants plus tard"
            + ' en cliquant le bouton "Modifier" du patient.',
          );

          const patientsArray = await dbPatients.getAll(psy.dossierNumber);

          patientsArray.length.should.equal(1);
          expect(patientsArray[0].psychologistId).to.equal(psy.dossierNumber);
          return Promise.resolve();
        });
    });

    it('should not create patient if user is not logged in', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };

      return chai.request(app)
      .post('/api/patients')
        .send({
          lastName: 'Lovelace',
          firstNames: 'Ada',
          INE: '12345678901',
          isINESvalid: false,
          institutionName: '42',
          isStudentStatusVerified: undefined,
          doctorName,
          dateOfBirth,
          gender,
        })
        .then(async (res) => {
          res.status.should.equal(401);

          // Patient not created
          const patientsArray = await dbPatients.getAll(psy.dossierNumber);
          expect(patientsArray).to.have.length(0);

          return Promise.resolve();
        });
    });
  });

  describe('create patient input validation', () => {
    let insertPatientStub;

    beforeEach(async () => {
      insertPatientStub = sinon.stub(dbPatients, 'insert')
        .returns(Promise.resolve([{
          firstNames: 'prenom',
          lastName: 'nom',
          INE: 'studentNumber',
          isINESvalid: false,
          institutionName: '42',
          isStudentStatusVerified: false,
          doctorName,
          dateOfBirth,
          gender,
        },
        ]));
      return Promise.resolve();
    });

    afterEach(async () => {
      insertPatientStub.restore();
      return Promise.resolve();
    });

    const shouldFailCreatePatientInputValidation = (done, postData, message) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };

      chai.request(app)
        .post('/api/patients')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send(postData)
        .end((err, res) => {
          res.status.should.equal(400);
          res.body.message.should.equal(message);

          sinon.assert.notCalled(insertPatientStub);

          done();
        });
    };

    it('should refuse empty firstNames', (done) => {
      shouldFailCreatePatientInputValidation(done, {
        // no firstNames
        lastName: 'Nom',
        INE: '1234567890A',
        isINESvalid: false,
        institutionName: '42',
        isStudentStatusVerified: undefined,
        doctorName,
        dateOfBirth,
        gender,
      }, 'Vous devez spécifier le.s prénom.s du patient.');
    });

    it('should refuse empty lastName', (done) => {
      shouldFailCreatePatientInputValidation(done, {
        firstNames: 'Blou Blou',
        // no lastName
        INE: '1234567890A',
        isINESvalid: false,
        institutionName: '42',
        isStudentStatusVerified: undefined,
        doctorName,
        dateOfBirth,
        gender,
      }, 'Vous devez spécifier le nom du patient.');
    });

    it('should refuse whitespace firstNames', (done) => {
      shouldFailCreatePatientInputValidation(done, {
        firstNames: '   ',
        lastName: 'Nom',
        INE: '1234567890A',
        isINESvalid: false,
        institutionName: '42',
        isStudentStatusVerified: undefined,
        doctorName,
        dateOfBirth,
        gender,
      }, 'Vous devez spécifier le.s prénom.s du patient.');
    });

    it('should refuse whitespace lastName', (done) => {
      shouldFailCreatePatientInputValidation(done, {
        firstNames: 'Blou Blou',
        lastName: '   ',
        INE: '1234567890A',
        isINESvalid: false,
        institutionName: '42',
        isStudentStatusVerified: undefined,
        doctorName,
        dateOfBirth,
        gender,
      }, 'Vous devez spécifier le nom du patient.');
    });

    it('should refuse INE with non-aphanumeric chars', (done) => {
      shouldFailCreatePatientInputValidation(done, {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '1234567890à',
        isINESvalid: false,
        institutionName: '42',
        isStudentStatusVerified: undefined,
        doctorName,
        dateOfBirth,
        gender,
      }, 'Le numéro INE est invalide. Veuillez vérifier le format.');
    });

    const shouldPassCreatePatientInputValidation = (done, postData) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };

      chai.request(app)
        .post('/api/patients')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send(postData)
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.message.should.equal(
            "L'étudiant Blou Blou Nom a bien été créé. Vous pourrez renseigner les champs manquants plus tard"
              + ' en cliquant le bouton "Modifier" du patient.',
          );

          sinon.assert.called(insertPatientStub);
          done();
        });
    };

    it('shouldn\'t pass INE with length not 11 chars', (done) => {
      shouldFailCreatePatientInputValidation(done, {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '1234567890AA',
        isINESvalid: false,
        institutionName: '42',
        isStudentStatusVerified: undefined,
        doctorName,
        dateOfBirth,
        gender,
      }, 'Le numéro INE est invalide. Veuillez vérifier le format.');
    });

    it('shouldn\'t pass patient with no dateOfBirth', (done) => {
      shouldFailCreatePatientInputValidation(done, {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '123456780AA',
        isINESvalid: false,
        institutionName: '42',
        isStudentStatusVerified: undefined,
        doctorName,
        dateOfBirth: '',
        gender,
      }, 'La date de naissance n\'est pas valide, le format doit être JJ/MM/AAAA.');
    });

    it('should NOT pass validation when INE is missing', (done) => {
      shouldFailCreatePatientInputValidation(done, {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '',
        isINESvalid: false,
        institutionName: '42',
        isStudentStatusVerified: undefined,
        doctorName,
        dateOfBirth,
        gender,
      }, 'Le numéro INE est obligatoire.');
    });

    it('shouldn\'t pass patient without gender', (done) => {
      shouldFailCreatePatientInputValidation(done, {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '123456790AA',
        isINESvalid: false,
        institutionName: '42',
        isStudentStatusVerified: undefined,
        doctorName,
        dateOfBirth,
        gender: '',
      }, 'Vous devez spécifier le genre du patient.');
    });

    it('should pass validation when all fields are correct', (done) => {
      shouldPassCreatePatientInputValidation(done, {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '1234567890A',
        isINESvalid: false,
        institutionName: '42',
        isStudentStatusVerified: undefined,
        doctorName,
        dateOfBirth,
        gender,
      });
    });

    it('should pass validation when institutionName is missing', (done) => {
      shouldPassCreatePatientInputValidation(done, {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '12345678912',
        isINESvalid: false,
        institutionName: '',
        isStudentStatusVerified: undefined,
        doctorName,
        dateOfBirth,
        gender,
      });
    });

    it('should sanitize string fields', (done) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };
      const postData = {
        firstNames: 'Blou Blou<div>',
        lastName: 'Nom</',
        dateOfBirth,
        gender,
        INE: '1234567890A',
        isINESvalid: false,
        institutionName: 'stuff<script>evil</script>',
        isStudentStatusVerified: undefined,
      };

      chai.request(app)
      .post('/api/patients')
      .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
      .set('xsrf-token', 'randomXSRFToken')
        .send(postData)
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.message.should.equal(
            "L'étudiant Blou Blou<div></div> Nom&lt;/ a bien été créé. Vous pourrez renseigner"
              + ' les champs manquants plus tard en cliquant le bouton "Modifier" du patient.',
          );
          sinon.assert.called(insertPatientStub);
          const expected = [
            sinon.match('Blou Blou<div></div>'),
            sinon.match('Nom&lt;/'),
            sinon.match.date,
            sinon.match('female'),
            sinon.match.string,
            true,
            sinon.match('stuff'),
            false,
          ];
          sinon.assert.calledWith(insertPatientStub, ...expected);
          done();
        });
    });
  });

  describe('display update patient form', () => {
    beforeEach(async (done) => {
      done();
    });

    afterEach(async () => {
      await clean.patients();
      return Promise.resolve();
    });

    it('should display form for my patient', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };
      const myPatient = await makePatient(psy.dossierNumber);

      return chai.request(app)
        .get(`/api/patients/${myPatient.id}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          expect(res.status).to.equal(200);
          res.status.should.equal(200);

          // The page displays myPatient
          res.body.firstNames.should.equal(myPatient.firstNames);
          res.body.lastName.should.equal(myPatient.lastName);
          res.body.id.should.equal(myPatient.id);
          res.body.institutionName.should.equal(myPatient.institutionName);
          res.body.doctorName.should.equal(myPatient.doctorName);
          res.body.dateOfBirth.should.equal(myPatient.dateOfBirth.toISOString());

          return Promise.resolve();
        });
    });

    it('should not display form if it is not my patient', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };
      const anotherPsyId = 'e43b8668-621d-40a7-86e0-c563b6b05509';
      const notMyPatient = await makePatient(anotherPsyId);

      return chai.request(app)
        .get(`/api/patients/${notMyPatient.id}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(404);
          res.body.message.should.equal('Ce patient n\'existe pas. Vous ne pouvez pas le modifier.');
          // The page does not display patient
          chai.assert.isUndefined(res.body.firstNames);
          chai.assert.isUndefined(res.body.lastName);
          chai.assert.isUndefined(res.body.id);
          chai.assert.isUndefined(res.body.institutionName);

          return Promise.resolve();
        });
    });

    it('should not display form if uuid is not valid', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };

      return chai.request(app)
        .get('/api/patients/notavalid-uuid')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(400);
          res.body.message.should.equal('Ce patient n\'existe pas.');

          return Promise.resolve();
        });
    });
  });

  describe('update patient', () => {
    beforeEach(async (done) => {
      done();
    });

    afterEach(async () => {
      await clean.patients();
      return Promise.resolve();
    });

    it('should update patient', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const patient = await makePatient(psy.dossierNumber);
      const updatedDateOfBirth = '25/02/1982';
      const updatedINE = '1234567890A';
      const updatedLastName = 'Lovelacekkk';
      const updatedFirstName = 'Adakkk';
      const updatedInstitution = 'polytech';
      return chai.request(app)
        .put(`/api/patients/${patient.id}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          lastName: updatedLastName,
          firstNames: updatedFirstName,
          INE: updatedINE,
          isINESvalid: false,
          institutionName: updatedInstitution,
          isStudentStatusVerified: 'isStudentStatusVerified',
          dateOfBirth: updatedDateOfBirth,
          gender: 'male',
        })
        .then(async (res) => {
          res.status.should.equal(200);
          res.body.message.should.equal(
            "L'étudiant Adakkk Lovelacekkk a bien été modifié. Vous pourrez renseigner les champs"
            + ' manquants plus tard en cliquant le bouton "Modifier" du patient.',
          );

          const patientsArray = await dbPatients.getAll(psy.dossierNumber);
          expect(patientsArray).to.have.length(1);
          expect(patientsArray[0].psychologistId).to.equal(psy.dossierNumber);
          expect(patientsArray[0].lastName).to.equal(updatedLastName);
          expect(patientsArray[0].firstNames).to.equal(updatedFirstName);
          expect(patientsArray[0].INE).to.equal(updatedINE);
          expect(patientsArray[0].institutionName).to.equal(updatedInstitution);
          expect(patientsArray[0].isStudentStatusVerified).to.equal(true);
          expect(patientsArray[0].dateOfBirth.getTime()).to.equal(
            new Date('1982/02/25').getTime(),
          );
          expect(patientsArray[0].gender).to.equal('male');

          return Promise.resolve();
        });
    });

    it('should update patient with minimum info', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const patient = await makePatient(psy.dossierNumber);
      return chai.request(app)
        .put(`/api/patients/${patient.id}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          lastName: patient.lastName,
          firstNames: patient.firstNames,
          INE: '1234567890A',
          isINESvalid: false,
          institutionName: '',
          isStudentStatusVerified: false,
          doctorName: '',
          dateOfBirth,
          gender,
        })
        .then(async (res) => {
          res.status.should.equal(200);

          const patientsArray = await dbPatients.getAll(psy.dossierNumber);
          expect(patientsArray).to.have.length(1);
          expect(patientsArray[0].psychologistId).to.equal(psy.dossierNumber);
          expect(patientsArray[0].lastName).to.equal(patient.lastName);
          expect(patientsArray[0].firstNames).to.equal(patient.firstNames);
          expect(patientsArray[0].INE).to.equal('1234567890A');
          expect(patientsArray[0].institutionName).to.equal('');
          expect(patientsArray[0].isStudentStatusVerified).to.equal(false);
          expect(patientsArray[0].dateOfBirth.getTime()).to.equal(
            new Date('1980/01/20').getTime(),
          );
          expect(patientsArray[0].gender).to.equal('female');
          expect(patientsArray[0].doctorName).to.equal('');

          return Promise.resolve();
        });
    });

    it('should not update patient if it is not mine', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const anotherPsyId = '495614e8-89af-4406-ba02-9fc038b991f9';
      const patient = await makePatient(anotherPsyId);
      return chai.request(app)
        .put(`/api/patients/${patient.id}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          lastName: 'Lovelacekkk',
          firstNames: 'Adakkk',
          INE: '1234567890A',
          isINESvalid: false,
          institutionName: 'Grande ecole',
          isStudentStatusVerified: 'isStudentStatusVerified',
          doctorName,
          dateOfBirth,
          gender,
        })
        .then(async (res) => {
          res.status.should.equal(404);
          res.body.message.should.equal('Ce patient n\'existe pas.');

          // Patient was not updated
          const patientsArray = await dbPatients.getAll(anotherPsyId);
          expect(patientsArray).to.have.length(1);
          expect(patientsArray[0].psychologistId).to.equal(anotherPsyId);
          expect(patientsArray[0].lastName).to.equal(patient.lastName);
          expect(patientsArray[0].firstNames).to.equal(patient.firstNames);
          expect(patientsArray[0].INE).to.equal(patient.INE);
          expect(patientsArray[0].institutionName).to.equal(patient.institutionName);
          expect(patientsArray[0].isStudentStatusVerified).to.equal(patient.isStudentStatusVerified);
          expect(patientsArray[0].dateOfBirth.getTime()).to.equal(
            new Date('1980/01/20').getTime(),
          );
          expect(patientsArray[0].gender).to.equal('female');

          return Promise.resolve();
        });
    });

    it('should not update patient if user is not logged in', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const patient = await makePatient(psy.dossierNumber);

      return chai.request(app)
        .put(`/api/patients/${patient.id}`)
        .send({
          lastName: 'Lovelacekkk',
          firstNames: 'Adakkk',
          INE: '1234567890A',
          isINESvalid: false,
          institutionName: 'Petite ecole',
          isStudentStatusVerified: 'isStudentStatusVerified',
          dateOfBirth,
          gender,
        })
        .then(async (res) => {
          res.status.should.equal(401);

          // Patient was not updated
          const patientsArray = await dbPatients.getAll(psy.dossierNumber);
          expect(patientsArray).to.have.length(1);
          expect(patientsArray[0].psychologistId).to.equal(psy.dossierNumber);
          expect(patientsArray[0].lastName).to.equal(patient.lastName);
          expect(patientsArray[0].firstNames).to.equal(patient.firstNames);
          expect(patientsArray[0].INE).to.equal(patient.INE);
          expect(patientsArray[0].institutionName).to.equal(patient.institutionName);
          expect(patientsArray[0].isStudentStatusVerified).to.equal(patient.isStudentStatusVerified);
          expect(patientsArray[0].dateOfBirth.getTime()).to.equal(
            new Date('1980/01/20').getTime(),
          );
          expect(patientsArray[0].gender).to.equal('female');

          return Promise.resolve();
        });
    });
  });

  describe('update patient input validation', () => {
    let updatePatientStub;

    beforeEach(async () => {
      updatePatientStub = sinon.stub(dbPatients, 'update');
      return Promise.resolve();
    });

    afterEach(async () => {
      updatePatientStub.restore();
      return Promise.resolve();
    });

    const shouldFailUpdatePatientInputValidation = (done, patientId, postData, message) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };

      chai.request(app)
        .put(`/api/patients/${patientId}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send(postData)
        .end((err, res) => {
          sinon.assert.notCalled(updatePatientStub);

          res.status.should.equal(400);
          res.body.message.should.equal(message);
          done();
        });
    };

    it('should refuse empty firstNames', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(
        done,
        patientId,
        {
        // no firstNames
          lastName: 'Nom',
          INE: '1234567890A',
          isINESvalid: false,
          institutionName: '42',
          isStudentStatusVerified: undefined,
          doctorName,
          dateOfBirth,
          gender,
        },
        'Vous devez spécifier le.s prénom.s du patient.',
      );
    });

    it('should refuse empty lastName', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(
        done,
        patientId,
        {
          firstNames: 'Blou Blou',
          // no lastName
          INE: '1234567890A',
          isINESvalid: false,
          institutionName: '42',
          isStudentStatusVerified: undefined,
          doctorName,
          dateOfBirth,
          gender,
        },
        'Vous devez spécifier le nom du patient.',
      );
    });

    it('should refuse whitespace firstNames', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(
        done,
        patientId,
        {
          firstNames: '   ',
          lastName: 'Nom',
          INE: '1234567890A',
          isINESvalid: false,
          institutionName: '42',
          isStudentStatusVerified: undefined,
          doctorName,
          dateOfBirth,
          gender,
        },
        'Vous devez spécifier le.s prénom.s du patient.',
      );
    });

    it('should refuse whitespace lastName', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(
        done,
        patientId,
        {
          firstNames: 'Blou Blou',
          lastName: '   ',
          INE: '1234567890A',
          isINESvalid: false,
          institutionName: '42',
          isStudentStatusVerified: undefined,
          doctorName,
          dateOfBirth,
          gender,
        },
        'Vous devez spécifier le nom du patient.',
      );
    });

    it('should refuse INE with non-alphanumeric chars', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(
        done,
        patientId,
        {
          firstNames: 'Blou Blou',
          lastName: 'Nom',
          INE: '1234567890à',
          isINESvalid: false,
          institutionName: '42',
          isStudentStatusVerified: undefined,
          doctorName,
          dateOfBirth,
          gender,
        },
        'Le numéro INE est invalide. Veuillez vérifier le format.',
      );
    });

    it('should refuse validation with INE length > 12 chars', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(
        done,
        patientId,
        {
          firstNames: 'Blou Blou',
          lastName: 'Nom',
          INE: '1'.repeat(12),
          isINESvalid: false,
          institutionName: '42',
          isStudentStatusVerified: undefined,
          doctorName,
          dateOfBirth,
          gender,
        },
        'Le numéro INE est invalide. Veuillez vérifier le format.',
      );
    });

    it('should refuse if patientId is not valid uuid', (done) => {
      shouldFailUpdatePatientInputValidation(
        done,
        'not-a-valid-uuid',
        {
          firstNames: 'Blou Blou',
          lastName: 'Nom',
          INE: '12345678901',
          isINESvalid: false,
          institutionName: '42',
          isStudentStatusVerified: undefined,
          doctorName,
          dateOfBirth,
          gender,
        },
        'Ce patient n\'existe pas.',
      );
    });

    it('should refuse if dateOfBirth is not valid', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(
        done,
        patientId,
        {
          firstNames: 'Blou Blou',
          lastName: 'Nom',
          INE: '1234567890A',
          isINESvalid: false,
          institutionName: '42',
          isStudentStatusVerified: undefined,
          doctorName,
          dateOfBirth: 'pizza time',
          gender,
        },
        'La date de naissance n\'est pas valide, le format doit être JJ/MM/AAAA.',
      );
    });

    it('should refuse if dateOfBirth is empty', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(
        done,
        patientId,
        {
          firstNames: 'Blou Blou',
          lastName: 'Nom',
          INE: '1234567890A',
          isINESvalid: false,
          institutionName: '42',
          isStudentStatusVerified: undefined,
          doctorName,
          dateOfBirth: '',
          gender,
        },
        'La date de naissance n\'est pas valide, le format doit être JJ/MM/AAAA.',
      );
    });

    it('should refuse if gender is empty', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(
        done,
        patientId,
        {
          firstNames: 'Blou Blou',
          lastName: 'Nom',
          INE: '1234567890A',
          isINESvalid: false,
          institutionName: '42',
          isStudentStatusVerified: undefined,
          doctorName,
          dateOfBirth,
          gender: '',
        },
        'Vous devez spécifier le genre du patient.',
      );
    });

    const shouldPassUpdatePatientInputValidation = (done, patientId, postData) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };

      chai.request(app)
        .put(`/api/patients/${patientId}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send(postData)
        .end((err, res) => {
          sinon.assert.called(updatePatientStub);
          res.status.should.equal(200);
          res.body.message.should.equal(
            "L'étudiant Blou Blou Nom a bien été modifié. Vous pourrez renseigner les champs manquants plus tard"
            + ' en cliquant le bouton "Modifier" du patient.',
          );
          done();
        });
    };

    it('should pass validation when all fields are correct', (done) => {
      shouldPassUpdatePatientInputValidation(done, '67687f5a-b9cf-4023-9258-fa72d8f1b4b3', {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '1234567890A',
        isINESvalid: false,
        institutionName: '42',
        isStudentStatusVerified: undefined,
        doctorName,
        dateOfBirth,
        gender,
      });
    });

    it('should not pass validation with INE length not 11 chars', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(done, patientId, {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '1234567890AA',
        isINESvalid: false,
        institutionName: '42',
        isStudentStatusVerified: undefined,
        doctorName,
        dateOfBirth,
        gender,
      }, 'Le numéro INE est invalide. Veuillez vérifier le format.');
    });

    it('should not pass validation when INE is missing', (done) => {
      shouldFailUpdatePatientInputValidation(done, '67687f5a-b9cf-4023-9258-fa72d8f1b4b3', {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        dateOfBirth,
        gender,
        INE: '',
        isINESvalid: false,
        institutionName: '42',
        isStudentStatusVerified: undefined,
        doctorName,
      }, 'Le numéro INE est obligatoire.');
    });

    it('should pass validation if doctor name is missing', (done) => {
      shouldPassUpdatePatientInputValidation(done, '67687f5a-b9cf-4023-9258-fa72d8f1b4b3', {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '1234567890A',
        isINESvalid: false,
        dateOfBirth,
        gender,
        institutionName: '42',
        isStudentStatusVerified: undefined,
      });
    });
  });

  describe('delete patient', () => {
    beforeEach(async () => {
      await clean.patients();
      return Promise.resolve();
    });

    afterEach(async () => {
      await clean.patients();
      return Promise.resolve();
    });

    it('should delete patient', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const patient = await makePatient(psy.dossierNumber);

      return chai.request(app)
        .delete(`/api/patients/${patient.id}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(200);
          res.body.message.should.equal("L'étudiant a bien été supprimé.");

          const patientsArray = await dbPatients.getAll(psy.dossierNumber);
          console.debug(patientsArray);
          expect(patientsArray).to.have.length(0);

          return Promise.resolve();
        });
    });

    it('should not delete patient if it is not mine', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const anotherPsyId = 'ccb6f32b-8c55-4322-8ecc-556e6900b4ea';
      const patient = await makePatient(anotherPsyId);

      return chai.request(app)
        .delete(`/api/patients/${patient.id}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(404);
          res.body.message.should.equal('Vous devez spécifier un étudiant à supprimer.');
          // Patient is not deleted
          const patientsArray = await dbPatients.getAll(anotherPsyId);
          expect(patientsArray).to.have.length(1);

          return Promise.resolve();
        });
    });

    it('should refuse invalid patientId', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const patient = await makePatient(psy.dossierNumber);

      return chai.request(app)
      .delete(`/api/patients/${patient.id}4`)
      .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
      .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(400);
          res.body.message.should.equal('Vous devez spécifier un étudiant à supprimer.');

          // Patient is not deleted
          const patientsArray = await dbPatients.getAll(psy.dossierNumber);
          expect(patientsArray).to.have.length(1);

          return Promise.resolve();
        });
    });

    it('should refuse patient with appointments', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const patient = await makePatient(psy.dossierNumber);
      await dbAppointments.insert(new Date('2022-01-01'), patient.id, psy.dossierNumber);

      return chai.request(app)
      .delete(`/api/patients/${patient.id}`)
      .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
      .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(400);
          res.body.message.should.equal('Vous ne pouvez pas supprimer un étudiant avec des séances.');

          // Patient is not deleted
          const patientsArray = await dbPatients.getAll(psy.dossierNumber);
          expect(patientsArray).to.have.length(1);

          return Promise.resolve();
        });
    });

    it('should not delete patient if user not logged in', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const patient = await makePatient(psy.dossierNumber);

      return chai.request(app)
      .delete(`/api/patients/${patient.id}`)
        .then(async (res) => {
          res.status.should.equal(401);

          // Patient is not deleted
          const patientsArray = await dbPatients.getAll(psy.dossierNumber);
          expect(patientsArray).to.have.length(1);

          return Promise.resolve();
        });
    });
  });
});
