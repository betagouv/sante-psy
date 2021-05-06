/* eslint-disable func-names */
const chai = require('chai');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../index');
const clean = require('./helper/clean');
const cookie = require('../utils/cookie');
const date = require('../utils/date');
const dbPatients = require('../db/patients');

const doctorName = 'doctorName';
const doctorAddress = 'doctorAddress';
const dateOfBirth = '20/01/1980';

const makePatient = async (psychologistId) => {
  // Insert an appointment and a patient
  const patient = await dbPatients.insertPatient(
    'Ada',
    'Lovelace',
    '12345678901',
    '42',
    false,
    false,
    psychologistId,
    doctorName,
    doctorAddress,
    date.parseDateForm(dateOfBirth),
  );
  // Check patient is inserted
  const createdPatient = await dbPatients.getPatientById(patient.id, psychologistId);
  chai.assert(!!createdPatient);
  return patient;
};

describe('patientsController', () => {
  describe('create patient', () => {
    beforeEach(async (done) => {
      done();
    });

    afterEach(async () => {
      await clean.cleanAllPatients();
      return Promise.resolve();
    });

    it('should create patient', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };

      return chai.request(app)
        .post('/psychologue/api/creer-nouveau-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          lastname: 'Lovelace',
          firstnames: 'Ada',
          ine: '12345678901',
          institution: 'test',
          isstudentstatusverified: undefined,
          hasprescription: undefined,
          doctorname: doctorName,
          doctoraddress: doctorAddress,
          dateofbirth: dateOfBirth,
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances');

          const patientsArray = await dbPatients.getPatients(psy.dossierNumber);

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
        .post('/psychologue/api/creer-nouveau-patient')
        // no auth cookie
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          lastname: 'Lovelace',
          firstnames: 'Ada',
          ine: '12345678901',
          institution: '42',
          isstudentstatusverified: undefined,
          hasprescription: undefined,
          doctorname: doctorName,
          doctoraddress: doctorAddress,
          dateofbirth: dateOfBirth,
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/login');

          // Patient not created
          const patientsArray = await dbPatients.getPatients(psy.dossierNumber);
          expect(patientsArray).to.have.length(0);

          return Promise.resolve();
        });
    });
  });

  describe('create patient input validation', () => {
    let insertPatientStub;

    beforeEach(async () => {
      insertPatientStub = sinon.stub(dbPatients, 'insertPatient')
        .returns(Promise.resolve([{
          firstnames: 'prenom',
          lastname: 'nom',
          ine: 'studentNumber',
          institution: '42',
          isStudentStatusVerified: false,
          hasPrescription: false,
          doctorname: doctorName,
          doctoraddress: doctorAddress,
          dateofbirth: dateOfBirth,
        },
        ]));
      return Promise.resolve();
    });

    afterEach(async () => {
      insertPatientStub.restore();
      return Promise.resolve();
    });

    const shouldFailCreatePatientInputValidation = (done, postData) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };

      chai.request(app)
        .post('/psychologue/api/creer-nouveau-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send(postData)
        .end((err, res) => {
          sinon.assert.notCalled(insertPatientStub);
          res.should.redirectTo('/psychologue/nouveau-patient');

          done();
        });
    };

    it('should refuse empty firstnames', (done) => {
      shouldFailCreatePatientInputValidation(done, {
        // no firstnames
        lastname: 'Nom',
        ine: '1234567890A',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      });
    });

    it('should refuse empty lastname', (done) => {
      shouldFailCreatePatientInputValidation(done, {
        firstnames: 'Blou Blou',
        // no lastname
        ine: '1234567890A',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      });
    });

    it('should refuse whitespace firstnames', (done) => {
      shouldFailCreatePatientInputValidation(done, {
        firstnames: '   ',
        lastname: 'Nom',
        ine: '1234567890A',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      });
    });

    it('should refuse whitespace lastname', (done) => {
      shouldFailCreatePatientInputValidation(done, {
        firstnames: 'Blou Blou',
        lastname: '   ',
        ine: '1234567890A',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      });
    });

    it('should refuse ine with non-aphanumeric chars', (done) => {
      shouldFailCreatePatientInputValidation(done, {
        firstnames: 'Blou Blou',
        lastname: 'Nom',
        ine: '1234567890à',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      });
    });

    const shouldPassCreatePatientInputValidation = (done, postData) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };

      chai.request(app)
        .post('/psychologue/api/creer-nouveau-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send(postData)
        .end((err, res) => {
          sinon.assert.called(insertPatientStub);
          res.should.redirectTo('/psychologue/mes-seances');
          done();
        });
    };

    it('should pass ine with length not 11 chars', (done) => {
      shouldPassCreatePatientInputValidation(done, {
        firstnames: 'Blou Blou',
        lastname: 'Nom',
        ine: '1234567890AA',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
      });
    });

    it('should pass validation when all fields are correct', (done) => {
      shouldPassCreatePatientInputValidation(done, {
        firstnames: 'Blou Blou',
        lastname: 'Nom',
        ine: '1234567890A',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      });
    });

    it('should pass validation when INE is missing', (done) => {
      shouldPassCreatePatientInputValidation(done, {
        firstnames: 'Blou Blou',
        lastname: 'Nom',
        ine: '',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      });
    });

    it('should pass validation when institution is missing', (done) => {
      shouldPassCreatePatientInputValidation(done, {
        firstnames: 'Blou Blou',
        lastname: 'Nom',
        ine: '',
        institution: '',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      });
    });

    it('should sanitize string fields', (done) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };
      const postData = {
        firstnames: 'Blou Blou<div>',
        lastname: 'Nom</',
        ine: '',
        institution: 'stuff<script>evil</script>',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      };

      chai.request(app)
        .post('/psychologue/api/creer-nouveau-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send(postData)
        .end((err, res) => {
          sinon.assert.called(insertPatientStub);
          const expected = [
            'Blou Blou<div></div>', // sanitized
            'Nom&lt;/', // sanitized
            sinon.match.string,
            'stuff', // sanitized
            false,
            false,
            sinon.match.string,
          ];

          sinon.assert.calledWith(insertPatientStub, ...expected);

          res.should.redirectTo('/psychologue/mes-seances');
          done();
        });
    });
  });

  describe('display update patient form', () => {
    beforeEach(async (done) => {
      done();
    });

    afterEach(async () => {
      await clean.cleanAllPatients();
      return Promise.resolve();
    });

    it('should display form for my patient', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };
      const myPatient = await makePatient(psy.dossierNumber);

      return chai.request(app)
        .get(`/psychologue/modifier-patient?patientid=${myPatient.id}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .then(async (res) => {
          expect(res.status).to.equal(200);

          // The page displays myPatient
          chai.assert.include(res.text, myPatient.firstNames);
          chai.assert.include(res.text, myPatient.lastName);
          chai.assert.include(res.text, myPatient.id);
          chai.assert.include(res.text, myPatient.institutionName);
          chai.assert.include(res.text, myPatient.doctorName);
          chai.assert.include(res.text, myPatient.doctorAddress);
          chai.assert.include(res.text, date.toFormatDDMMYYYY(myPatient.dateOfBirth));

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
        .get(`/psychologue/modifier-patient?patientid=${notMyPatient.id}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances');

          // The page does not display patient
          chai.assert.notInclude(res.text, notMyPatient.firstNames);
          chai.assert.notInclude(res.text, notMyPatient.lastName);
          chai.assert.notInclude(res.text, notMyPatient.id);
          chai.assert.notInclude(res.text, notMyPatient.institution);

          return Promise.resolve();
        });
    });

    it('should not display form if uuid is not valid', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };

      return chai.request(app)
        .get('/psychologue/modifier-patient?patientid=not-a-valid-uuid')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances');

          return Promise.resolve();
        });
    });
  });

  describe('update patient', () => {
    beforeEach(async (done) => {
      done();
    });

    afterEach(async () => {
      await clean.cleanAllPatients();
      return Promise.resolve();
    });

    it('should update patient', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const patient = await makePatient(psy.dossierNumber);
      const updatedDateOfBirth = '25/02/1982';
      const updatedINE = '111222333rr';
      const updatedLastName = 'Lovelacekkk';
      const updatedFirstName = 'Adakkk';
      const updatedInstitution = 'polytech';
      return chai.request(app)
        .post('/psychologue/api/modifier-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          patientid: patient.id,
          lastname: updatedLastName,
          firstnames: updatedFirstName,
          ine: updatedINE,
          institution: updatedInstitution,
          isstudentstatusverified: 'isstudentstatusverified',
          hasprescription: 'hasprescription',
          doctorname: doctorName,
          dateofbirth: updatedDateOfBirth,
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances');

          const patientsArray = await dbPatients.getPatients(psy.dossierNumber);
          expect(patientsArray).to.have.length(1);
          expect(patientsArray[0].psychologistId).to.equal(psy.dossierNumber);
          expect(patientsArray[0].lastName).to.equal(updatedLastName);
          expect(patientsArray[0].firstNames).to.equal(updatedFirstName);
          expect(patientsArray[0].INE).to.equal(updatedINE);
          expect(patientsArray[0].institutionName).to.equal(updatedInstitution);
          expect(patientsArray[0].isStudentStatusVerified).to.equal(true);
          expect(patientsArray[0].hasPrescription).to.equal(true);
          expect(patientsArray[0].dateOfBirth.getTime()).to.equal(
            date.parseDateForm(updatedDateOfBirth).getTime(),
          );

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
        .post('/psychologue/api/modifier-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          patientid: patient.id,
          lastname: 'Lovelacekkk',
          firstnames: 'Adakkk',
          ine: '111222333SS',
          institution: 'Grande ecole',
          isstudentstatusverified: 'isstudentstatusverified',
          hasprescription: 'hasprescription',
          doctorname: doctorName,
          doctoraddress: doctorAddress,
          dateofbirth: dateOfBirth,
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances');

          // Patient was not updated
          const patientsArray = await dbPatients.getPatients(anotherPsyId);
          expect(patientsArray).to.have.length(1);
          expect(patientsArray[0].psychologistId).to.equal(anotherPsyId);
          expect(patientsArray[0].lastName).to.equal(patient.lastName);
          expect(patientsArray[0].firstNames).to.equal(patient.firstNames);
          expect(patientsArray[0].INE).to.equal(patient.INE);
          expect(patientsArray[0].institution).to.equal(patient.institution);
          expect(patientsArray[0].isStudentStatusVerified).to.equal(patient.isStudentStatusVerified);
          expect(patientsArray[0].hasPrescription).to.equal(patient.hasPrescription);
          expect(patientsArray[0].dateOfBirth.getTime()).to.equal(
            date.parseDateForm(dateOfBirth).getTime(),
          );

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
        .post('/psychologue/api/modifier-patient')
        // no auth cookie
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          patientid: patient.id,
          lastname: 'Lovelacekkk',
          firstnames: 'Adakkk',
          ine: '111',
          institution: 'Petite ecole',
          isstudentstatusverified: 'isstudentstatusverified',
          hasprescription: 'hasprescription',
          dateofbirth: dateOfBirth,
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/login');

          // Patient was not updated
          const patientsArray = await dbPatients.getPatients(psy.dossierNumber);
          expect(patientsArray).to.have.length(1);
          expect(patientsArray[0].psychologistId).to.equal(psy.dossierNumber);
          expect(patientsArray[0].lastName).to.equal(patient.lastName);
          expect(patientsArray[0].firstNames).to.equal(patient.firstNames);
          expect(patientsArray[0].INE).to.equal(patient.INE);
          expect(patientsArray[0].institution).to.equal(patient.institution);
          expect(patientsArray[0].isStudentStatusVerified).to.equal(patient.isStudentStatusVerified);
          expect(patientsArray[0].hasPrescription).to.equal(patient.hasPrescription);
          expect(patientsArray[0].dateOfBirth.getTime()).to.equal(
            date.parseDateForm(dateOfBirth).getTime(),
          );

          return Promise.resolve();
        });
    });
  });

  describe('update patient input validation', () => {
    let updatePatientStub;

    beforeEach(async () => {
      updatePatientStub = sinon.stub(dbPatients, 'updatePatient');
      return Promise.resolve();
    });

    afterEach(async () => {
      updatePatientStub.restore();
      return Promise.resolve();
    });

    const shouldFailUpdatePatientInputValidation = (done, postData, expectedRedirectUrl) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };

      chai.request(app)
        .post('/psychologue/api/modifier-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send(postData)
        .end((err, res) => {
          sinon.assert.notCalled(updatePatientStub);
          res.should.redirectTo(expectedRedirectUrl);

          done();
        });
    };

    it('should refuse empty firstnames', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(done, {
        patientid: patientId,
        // no firstnames
        lastname: 'Nom',
        ine: '1234567890A',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      },
      `/psychologue/modifier-patient?patientid=${patientId}`);
    });

    it('should refuse empty lastname', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(done, {
        patientid: patientId,
        firstnames: 'Blou Blou',
        // no lastname
        ine: '1234567890A',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      },
      `/psychologue/modifier-patient?patientid=${patientId}`);
    });

    it('should refuse whitespace firstnames', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(done, {
        patientid: patientId,
        firstnames: '   ',
        lastname: 'Nom',
        ine: '1234567890A',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      },
      `/psychologue/modifier-patient?patientid=${patientId}`);
    });

    it('should refuse whitespace lastname', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(done, {
        patientid: patientId,
        firstnames: 'Blou Blou',
        lastname: '   ',
        ine: '1234567890A',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      },
      `/psychologue/modifier-patient?patientid=${patientId}`);
    });

    it('should refuse ine with non-aphanumeric chars', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(done, {
        patientid: patientId,
        firstnames: 'Blou Blou',
        lastname: 'Nom',
        ine: '1234567890à',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      },
      `/psychologue/modifier-patient?patientid=${patientId}`);
    });

    it('should refuse validation with ine length > 50 chars', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(done, {
        patientid: patientId,
        firstnames: 'Blou Blou',
        lastname: 'Nom',
        ine: '1'.repeat(51),
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      },
      `/psychologue/modifier-patient?patientid=${patientId}`);
    });

    it('should refuse if no patientid', (done) => {
      shouldFailUpdatePatientInputValidation(done, {
        patientid: '',
        firstnames: 'Blou Blou',
        lastname: 'Nom',
        ine: '1234567890à',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      },
      '/psychologue/mes-seances');
    });

    it('should refuse if patientid is not valid uuid', (done) => {
      shouldFailUpdatePatientInputValidation(done, {
        patientid: 'not-a-valid-uuid',
        firstnames: 'Blou Blou',
        lastname: 'Nom',
        ine: '1234567890à',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      },
      '/psychologue/mes-seances');
    });

    it('should refuse if dateOfBirth is not valid', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(done, {
        patientid: patientId,
        firstnames: 'Blou Blou',
        lastname: 'Nom',
        ine: '1234567890A',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: 'pizza time',
      },
      `/psychologue/modifier-patient?patientid=${patientId}`);
    });

    const shouldPassUpdatePatientInputValidation = (done, postData) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };

      chai.request(app)
        .post('/psychologue/api/modifier-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send(postData)
        .end((err, res) => {
          sinon.assert.called(updatePatientStub);
          res.should.redirectTo('/psychologue/mes-seances');
          done();
        });
    };

    it('should pass validation when all fields are correct', (done) => {
      shouldPassUpdatePatientInputValidation(done, {
        patientid: '67687f5a-b9cf-4023-9258-fa72d8f1b4b3',
        firstnames: 'Blou Blou',
        lastname: 'Nom',
        ine: '1234567890A',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      });
    });

    it('should pass validation with ine length not 11 chars', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldPassUpdatePatientInputValidation(done, {
        patientid: patientId,
        firstnames: 'Blou Blou',
        lastname: 'Nom',
        ine: '1234567890AA',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
      },
      `/psychologue/modifier-patient?patientid=${patientId}`);
    });

    it('should pass validation when INE is missing', (done) => {
      shouldPassUpdatePatientInputValidation(done, {
        patientid: '67687f5a-b9cf-4023-9258-fa72d8f1b4b3',
        firstnames: 'Blou Blou',
        lastname: 'Nom',
        ine: '',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
        dateofbirth: dateOfBirth,
      });
    });

    it('should pass validation when dateOfBirth is missing', (done) => {
      shouldPassUpdatePatientInputValidation(done, {
        patientid: '67687f5a-b9cf-4023-9258-fa72d8f1b4b3',
        firstnames: 'Blou Blou',
        lastname: 'Nom',
        ine: '1234567890A',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
        doctorname: doctorName,
        doctoraddress: doctorAddress,
      });
    });

    it('should pass validation if doctor name, phone and address are missing', (done) => {
      shouldPassUpdatePatientInputValidation(done, {
        patientid: '67687f5a-b9cf-4023-9258-fa72d8f1b4b3',
        firstnames: 'Blou Blou',
        lastname: 'Nom',
        ine: '',
        institution: '42',
        isstudentstatusverified: undefined,
        hasprescription: undefined,
      });
    });
  });

  describe('delete patient', () => {
    beforeEach(async () => {
      await clean.cleanAllPatients();
      return Promise.resolve();
    });

    afterEach(async () => {
      await clean.cleanAllPatients();
      return Promise.resolve();
    });

    it('should delete patient', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const patient = await makePatient(psy.dossierNumber);

      return chai.request(app)
        .post('/psychologue/api/supprimer-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          patientId: patient.id,
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances');

          const patientsArray = await dbPatients.getPatients(psy.dossierNumber);
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
        .post('/psychologue/api/supprimer-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          patientId: patient.id,
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances');
          // Patient is not deleted
          const patientsArray = await dbPatients.getPatients(anotherPsyId);
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
        .post('/psychologue/api/supprimer-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          patientId: `${patient.id}4`,
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances');

          // Patient is not deleted
          const patientsArray = await dbPatients.getPatients(psy.dossierNumber);
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
        .post('/psychologue/api/supprimer-patient')
        // no auth cookie
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          patientId: patient.id,
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/login');

          // Patient is not deleted
          const patientsArray = await dbPatients.getPatients(psy.dossierNumber);
          expect(patientsArray).to.have.length(1);

          return Promise.resolve();
        });
    });

    it('should refuse empty patientId', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      await makePatient(psy.dossierNumber);

      return chai.request(app)
        .post('/psychologue/api/supprimer-patient')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0) // block redirects, we don't want to test them
        .type('form')
        .send({
          // no patientId
        })
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances');

          const patientsArray = await dbPatients.getPatients(psy.dossierNumber);
          expect(patientsArray).to.have.length(1);

          return Promise.resolve();
        });
    });
  });
});
