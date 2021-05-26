/* eslint-disable func-names */
const chai = require('chai');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../index.ts');
const clean = require('./helper/clean');
const jwt = require('../utils/jwt');
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
  chai.assert.exists(createdPatient);
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
        .post('/api/patients')
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .send({
          lastName: 'Lovelace',
          firstNames: 'Ada',
          INE: '12345678901',
          institutionName: 'test',
          isStudentStatusVerified: undefined,
          hasPrescription: undefined,
          doctorName,
          doctorAddress,
          dateOfBirth,
        })
        .then(async (res) => {
          res.body.success.should.equal(true);
          res.body.message.should.equal(
            'Le patient Ada Lovelace a bien été créé. Vous pourrez renseigner les champs manquants plus tard'
            + ' en cliquant le bouton "Modifier" du patient.',
          );

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
      .post('/api/patients')
        .send({
          lastName: 'Lovelace',
          firstNames: 'Ada',
          INE: '12345678901',
          institutionName: '42',
          isStudentStatusVerified: undefined,
          hasPrescription: undefined,
          doctorName,
          doctorAddress,
          dateOfBirth,
        })
        .then(async (res) => {
          res.status.should.equal(401);

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
          firstNames: 'prenom',
          lastName: 'nom',
          INE: 'studentNumber',
          institutionName: '42',
          isStudentStatusVerified: false,
          hasPrescription: false,
          doctorName,
          doctorAddress,
          dateOfBirth,
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
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .send(postData)
        .end((err, res) => {
          res.body.success.should.equal(false);
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
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth,
      }, 'Vous devez spécifier le.s prénom.s du patient.');
    });

    it('should refuse empty lastName', (done) => {
      shouldFailCreatePatientInputValidation(done, {
        firstNames: 'Blou Blou',
        // no lastName
        INE: '1234567890A',
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth,
      }, 'Vous devez spécifier le nom du patient.');
    });

    it('should refuse whitespace firstNames', (done) => {
      shouldFailCreatePatientInputValidation(done, {
        firstNames: '   ',
        lastName: 'Nom',
        INE: '1234567890A',
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth,
      }, 'Vous devez spécifier le.s prénom.s du patient.');
    });

    it('should refuse whitespace lastName', (done) => {
      shouldFailCreatePatientInputValidation(done, {
        firstNames: 'Blou Blou',
        lastName: '   ',
        INE: '1234567890A',
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth,
      }, 'Vous devez spécifier le nom du patient.');
    });

    it('should refuse INE with non-aphanumeric chars', (done) => {
      shouldFailCreatePatientInputValidation(done, {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '1234567890à',
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth,
      }, 'Le numéro INE doit faire maximum 50 caractères alphanumériques (chiffres ou lettres sans accents).\n'
      + '    Si vous ne l\'avez pas maintenant, ce n\'est pas grave, vous pourrez y revenir plus tard.');
    });

    const shouldPassCreatePatientInputValidation = (done, postData) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };

      chai.request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .send(postData)
        .end((err, res) => {
          res.body.success.should.equal(true);
          res.body.message.should.equal(
            'Le patient Blou Blou Nom a bien été créé. Vous pourrez renseigner les champs manquants plus tard'
              + ' en cliquant le bouton "Modifier" du patient.',
          );

          sinon.assert.called(insertPatientStub);
          done();
        });
    };

    it('should pass INE with length not 11 chars', (done) => {
      shouldPassCreatePatientInputValidation(done, {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '1234567890AA',
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
      });
    });

    it('should pass validation when all fields are correct', (done) => {
      shouldPassCreatePatientInputValidation(done, {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '1234567890A',
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth,
      });
    });

    it('should pass validation when INE is missing', (done) => {
      shouldPassCreatePatientInputValidation(done, {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '',
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth,
      });
    });

    it('should pass validation when institutionName is missing', (done) => {
      shouldPassCreatePatientInputValidation(done, {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '',
        institutionName: '',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth,
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
        INE: '',
        institutionName: 'stuff<script>evil</script>',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth,
      };

      chai.request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .send(postData)
        .end((err, res) => {
          res.body.success.should.equal(true);
          res.body.message.should.equal(
            'Le patient Blou Blou<div></div> Nom&lt;/ a bien été créé. Vous pourrez renseigner'
              + ' les champs manquants plus tard en cliquant le bouton "Modifier" du patient.',
          );
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
        .get(`/api/patients/${myPatient.id}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .then(async (res) => {
          expect(res.status).to.equal(200);
          res.body.success.should.equal(true);

          // The page displays myPatient
          res.body.patient.firstNames.should.equal(myPatient.firstNames);
          res.body.patient.lastName.should.equal(myPatient.lastName);
          res.body.patient.id.should.equal(myPatient.id);
          res.body.patient.institutionName.should.equal(myPatient.institutionName);
          res.body.patient.doctorName.should.equal(myPatient.doctorName);
          res.body.patient.doctorAddress.should.equal(myPatient.doctorAddress);
          res.body.patient.dateOfBirth.should.equal(myPatient.dateOfBirth.toISOString());

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
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .then(async (res) => {
          res.body.success.should.equal(false);
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
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .then(async (res) => {
          res.body.success.should.equal(false);
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
        .put(`/api/patients/${patient.id}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .send({
          lastName: updatedLastName,
          firstNames: updatedFirstName,
          INE: updatedINE,
          institutionName: updatedInstitution,
          isStudentStatusVerified: 'isStudentStatusVerified',
          hasPrescription: 'hasPrescription',
          doctorName,
          dateOfBirth: updatedDateOfBirth,
        })
        .then(async (res) => {
          res.body.success.should.equal(true);
          res.body.message.should.equal(
            'Le patient Adakkk Lovelacekkk a bien été modifié. Vous pourrez renseigner les champs'
            + ' manquants plus tard en cliquant le bouton "Modifier" du patient.',
          );

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
        .put(`/api/patients/${patient.id}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .send({
          lastName: 'Lovelacekkk',
          firstNames: 'Adakkk',
          INE: '111222333SS',
          institutionName: 'Grande ecole',
          isStudentStatusVerified: 'isStudentStatusVerified',
          hasPrescription: 'hasPrescription',
          doctorName,
          doctorAddress,
          dateOfBirth,
        })
        .then(async (res) => {
          res.body.success.should.equal(false);
          res.body.message.should.equal('Ce patient n\'existe pas.');

          // Patient was not updated
          const patientsArray = await dbPatients.getPatients(anotherPsyId);
          expect(patientsArray).to.have.length(1);
          expect(patientsArray[0].psychologistId).to.equal(anotherPsyId);
          expect(patientsArray[0].lastName).to.equal(patient.lastName);
          expect(patientsArray[0].firstNames).to.equal(patient.firstNames);
          expect(patientsArray[0].INE).to.equal(patient.INE);
          expect(patientsArray[0].institutionName).to.equal(patient.institutionName);
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
        .put(`/api/patients/${patient.id}`)
        .send({
          lastName: 'Lovelacekkk',
          firstNames: 'Adakkk',
          INE: '111',
          institutionName: 'Petite ecole',
          isStudentStatusVerified: 'isStudentStatusVerified',
          hasPrescription: 'hasPrescription',
          dateOfBirth,
        })
        .then(async (res) => {
          res.status.should.equal(401);

          // Patient was not updated
          const patientsArray = await dbPatients.getPatients(psy.dossierNumber);
          expect(patientsArray).to.have.length(1);
          expect(patientsArray[0].psychologistId).to.equal(psy.dossierNumber);
          expect(patientsArray[0].lastName).to.equal(patient.lastName);
          expect(patientsArray[0].firstNames).to.equal(patient.firstNames);
          expect(patientsArray[0].INE).to.equal(patient.INE);
          expect(patientsArray[0].institutionName).to.equal(patient.institutionName);
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

    const shouldFailUpdatePatientInputValidation = (done, patientId, postData, message) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };

      chai.request(app)
        .put(`/api/patients/${patientId}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .send(postData)
        .end((err, res) => {
          sinon.assert.notCalled(updatePatientStub);

          res.body.success.should.equal(false);
          res.body.message.should.equal(message);
          done();
        });
    };

    it('should refuse empty firstNames', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(done, patientId, {
        // no firstNames
        lastName: 'Nom',
        INE: '1234567890A',
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth,
      },
      'Vous devez spécifier le.s prénom.s du patient.');
    });

    it('should refuse empty lastName', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(done, patientId, {
        firstNames: 'Blou Blou',
        // no lastName
        INE: '1234567890A',
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth,
      },
      'Vous devez spécifier le nom du patient.');
    });

    it('should refuse whitespace firstNames', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(done, patientId, {
        firstNames: '   ',
        lastName: 'Nom',
        INE: '1234567890A',
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth,
      },
      'Vous devez spécifier le.s prénom.s du patient.');
    });

    it('should refuse whitespace lastName', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(done, patientId, {
        firstNames: 'Blou Blou',
        lastName: '   ',
        INE: '1234567890A',
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth,
      },
      'Vous devez spécifier le nom du patient.');
    });

    it('should refuse INE with non-aphanumeric chars', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(done, patientId, {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '1234567890à',
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth,
      },
      'Le numéro INE doit faire maximum 50 caractères alphanumériques (chiffres ou lettres sans accents).\n'
      + '    Si vous ne l\'avez pas maintenant, ce n\'est pas grave, vous pourrez y revenir plus tard.');
    });

    it('should refuse validation with INE length > 50 chars', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(done, patientId, {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '1'.repeat(51),
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth,
      },
      'Le numéro INE doit faire maximum 50 caractères alphanumériques (chiffres ou lettres sans accents).\n'
      + '    Si vous ne l\'avez pas maintenant, ce n\'est pas grave, vous pourrez y revenir plus tard.');
    });

    it('should refuse if patientId is not valid uuid', (done) => {
      shouldFailUpdatePatientInputValidation(done, 'not-a-valid-uuid', {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '12345678901',
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth,
      },
      'Ce patient n\'existe pas.');
    });

    it('should refuse if dateOfBirth is not valid', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldFailUpdatePatientInputValidation(done, patientId, {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '1234567890A',
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth: 'pizza time',
      },
      'La date de naissance n\'est pas valide, le format doit être JJ/MM/AAAA.\n'
      + '    Si vous ne l\'avez pas maintenant, ce n\'est pas grave, vous pourrez y revenir plus tard.');
    });

    const shouldPassUpdatePatientInputValidation = (done, patientId, postData) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };

      chai.request(app)
        .put(`/api/patients/${patientId}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .send(postData)
        .end((err, res) => {
          sinon.assert.called(updatePatientStub);
          res.body.success.should.equal(true);
          res.body.message.should.equal(
            'Le patient Blou Blou Nom a bien été modifié. Vous pourrez renseigner les champs manquants plus tard'
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
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth,
      });
    });

    it('should pass validation with INE length not 11 chars', (done) => {
      const patientId = '67687f5a-b9cf-4023-9258-fa72d8f1b4b3';
      shouldPassUpdatePatientInputValidation(done, patientId, {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '1234567890AA',
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
      });
    });

    it('should pass validation when INE is missing', (done) => {
      shouldPassUpdatePatientInputValidation(done, '67687f5a-b9cf-4023-9258-fa72d8f1b4b3', {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '',
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
        dateOfBirth,
      });
    });

    it('should pass validation when dateOfBirth is missing', (done) => {
      shouldPassUpdatePatientInputValidation(done, '67687f5a-b9cf-4023-9258-fa72d8f1b4b3', {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '1234567890A',
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
        doctorName,
        doctorAddress,
      });
    });

    it('should pass validation if doctor name, phone and address are missing', (done) => {
      shouldPassUpdatePatientInputValidation(done, '67687f5a-b9cf-4023-9258-fa72d8f1b4b3', {
        firstNames: 'Blou Blou',
        lastName: 'Nom',
        INE: '',
        institutionName: '42',
        isStudentStatusVerified: undefined,
        hasPrescription: undefined,
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
        .delete(`/api/patients/${patient.id}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .then(async (res) => {
          res.body.success.should.equal(true);
          res.body.message.should.equal('Le patient a bien été supprimé.');

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
        .delete(`/api/patients/${patient.id}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .then(async (res) => {
          res.body.success.should.equal(false);
          res.body.message.should.equal('Vous devez spécifier un patient à supprimer.');
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
      .delete(`/api/patients/${patient.id}4`)
      .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .then(async (res) => {
          res.body.success.should.equal(false);
          res.body.message.should.equal('Vous devez spécifier un patient à supprimer.');

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
      .delete(`/api/patients/${patient.id}`)
        .then(async (res) => {
          res.status.should.equal(401);

          // Patient is not deleted
          const patientsArray = await dbPatients.getPatients(psy.dossierNumber);
          expect(patientsArray).to.have.length(1);

          return Promise.resolve();
        });
    });
  });
});
