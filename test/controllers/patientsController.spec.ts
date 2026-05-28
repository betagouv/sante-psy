import chai, { expect } from 'chai';
import app from '../../index';
import clean from '../helper/clean';
import create from '../helper/create';
import cookie from '../../utils/cookie';
import dbPatients from '../../db/patients';
import dbAppointments from '../../db/appointments';
import dbPsychologists from '../../db/psychologists';

const doctorName = 'doctorName';
const dateOfBirth = '20/01/1980';
const gender = 'female';

const createPsy = async (psyId) => {
  const psy = create.getOnePsy();
  psy.dossierNumber = psyId;
  await dbPsychologists.upsertMany([psy]);
};
const makePatient = async (psychologistId, INE = '12345678901') => {
  await createPsy(psychologistId);
  // Insert an appointment and a patient
  const student = await create.insertOneStudent({
    ine: INE,
  });
  const patient = await dbPatients.insert(psychologistId, student.id);
  // Check patient is inserted
  const createdPatient = await dbPatients.getById(patient.id, psychologistId);
  chai.assert.exists(createdPatient);
  return createdPatient;
};

describe('patientsController', () => {
  describe('get all patients', () => {
    beforeEach(async () => {
      await clean.patients();
      await clean.students();
    });

    afterEach(async () => {
      await clean.patients();
      await clean.students();
      return Promise.resolve();
    });

    it('should get all patients', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };
      const myPatient = await makePatient(psy.dossierNumber);
      await dbAppointments.insert(
        new Date('2021-04-01'),
        myPatient.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(new Date(), myPatient.id, psy.dossierNumber);

      return chai
        .request(app)
        .get('/api/patients')
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          expect(res.status).to.equal(200);
          res.status.should.equal(200);

          res.body.length.should.equal(1);
          res.body[0].firstNames.should.equal(myPatient.firstNames);
          res.body[0].lastName.should.equal(myPatient.lastName);
          res.body[0].id.should.equal(myPatient.id);
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
      await createPsy(anotherPsy.dossierNumber);
      const myPatient = await makePatient(psy.dossierNumber, '12345698563');
      console.log('myPatient.student.id', myPatient.student.id);
      const myPatientOtherPsy = await dbPatients.insert(
        anotherPsy.dossierNumber,
        myPatient.student.id,
      );

      await dbAppointments.insert(
        new Date('2021-04-01'),
        myPatient.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(new Date(), myPatient.id, psy.dossierNumber);
      const toDelete = await dbAppointments.insert(
        new Date(),
        myPatient.id,
        psy.dossierNumber,
      );
      dbAppointments.delete(toDelete.id, psy.dossierNumber);

      await dbAppointments.insert(
        new Date(),
        myPatientOtherPsy.id,
        anotherPsy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date(),
        myPatientOtherPsy.id,
        anotherPsy.dossierNumber,
      );

      return chai
        .request(app)
        .get('/api/patients')
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          expect(res.status).to.equal(200);
          res.status.should.equal(200);

          res.body.length.should.equal(1);
          res.body[0].firstNames.should.equal(myPatient.firstNames);
          res.body[0].lastName.should.equal(myPatient.lastName);
          res.body[0].id.should.equal(myPatient.id);
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
      await dbAppointments.insert(
        new Date(`${currentSchoolYear - 1}-11-01`),
        myPatient.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date(`${currentSchoolYear - 1}-12-02`),
        myPatient.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date(`${currentSchoolYear}-02-04`),
        myPatient.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date(`${currentSchoolYear}-05-06`),
        myPatient.id,
        psy.dossierNumber,
      );

      // current school year
      await dbAppointments.insert(
        new Date(`${currentSchoolYear}-09-01`),
        myPatient.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date(`${currentSchoolYear}-10-01`),
        myPatient.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date(`${currentSchoolYear}-11-01`),
        myPatient.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date(`${currentSchoolYear}-12-01`),
        myPatient.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date(`${currentSchoolYear + 1}-04-01`),
        myPatient.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date(`${currentSchoolYear + 1}-05-01`),
        myPatient.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date(`${currentSchoolYear + 1}-07-01`),
        myPatient.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date(`${currentSchoolYear + 1}-07-05`),
        myPatient.id,
        psy.dossierNumber,
      );
      await dbAppointments.insert(
        new Date(`${currentSchoolYear + 1}-07-20`),
        myPatient.id,
        psy.dossierNumber,
      );

      return chai
        .request(app)
        .get('/api/patients')
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          expect(res.status).to.equal(200);
          res.status.should.equal(200);

          res.body.length.should.equal(1);
          res.body[0].firstNames.should.equal(myPatient.firstNames);
          res.body[0].lastName.should.equal(myPatient.lastName);
          res.body[0].id.should.equal(myPatient.id);
          res.body[0].appointmentsCount.should.equal('13');
          res.body[0].appointmentsYearCount.should.equal('9');

          return Promise.resolve();
        });
    });
  });

  describe('create patient from a student', () => {
    beforeEach(async (done) => {
      done();
    });

    afterEach(async () => {
      await clean.patients();
      await clean.students();
      return Promise.resolve();
    });

    it('should create patient', async () => {
      const psy = await create.insertOnePsy();
      const student = await create.insertOneStudent();

      return chai
        .request(app)
        .post('/api/patients')
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          studentId: student.id,
        })
        .then(async (res) => {
          res.status.should.equal(200);
          res.body.newPatient.student_id.should.equal(student.id);

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

      return chai
        .request(app)
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

  describe('display update patient form', () => {
    beforeEach(async (done) => {
      done();
    });

    afterEach(async () => {
      await clean.patients();
      await clean.students();
      return Promise.resolve();
    });

    it('should display form for my patient', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };
      const myPatient = await makePatient(psy.dossierNumber);

      return chai
        .request(app)
        .get(`/api/patients/${myPatient.id}`)
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          expect(res.status).to.equal(200);
          res.status.should.equal(200);

          // The page displays myPatient
          res.body.firstNames.should.equal(myPatient.firstNames);
          res.body.lastName.should.equal(myPatient.lastName);
          res.body.id.should.equal(myPatient.id);

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

      return chai
        .request(app)
        .get(`/api/patients/${notMyPatient.id}`)
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(404);
          res.body.message.should.equal(
            "Ce patient n'existe pas. Vous ne pouvez pas le modifier.",
          );
          // The page does not display patient
          chai.assert.isUndefined(res.body.firstNames);
          chai.assert.isUndefined(res.body.lastName);
          chai.assert.isUndefined(res.body.id);

          return Promise.resolve();
        });
    });

    it('should not display form if uuid is not valid', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'valid@valid.org',
      };

      return chai
        .request(app)
        .get('/api/patients/notavalid-uuid')
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(400);
          res.body.message.should.equal("Ce patient n'existe pas.");

          return Promise.resolve();
        });
    });
  });

  describe('delete patient', () => {
    beforeEach(async () => {
      await clean.patients();
      await clean.students();
      return Promise.resolve();
    });

    afterEach(async () => {
      await clean.patients();
      await clean.students();
      return Promise.resolve();
    });

    it('should delete patient', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const patient = await makePatient(psy.dossierNumber);

      return chai
        .request(app)
        .delete(`/api/patients/${patient.id}`)
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
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

      return chai
        .request(app)
        .delete(`/api/patients/${patient.id}`)
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(404);
          res.body.message.should.equal(
            'Vous devez spécifier un étudiant à supprimer.',
          );
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

      return chai
        .request(app)
        .delete(`/api/patients/${patient.id}4`)
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(400);
          res.body.message.should.equal(
            'Vous devez spécifier un étudiant à supprimer.',
          );

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
      await dbAppointments.insert(
        new Date('2022-01-01'),
        patient.id,
        psy.dossierNumber,
      );

      return chai
        .request(app)
        .delete(`/api/patients/${patient.id}`)
        .set(
          'Cookie',
          `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`,
        )
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(400);
          res.body.message.should.equal(
            'Vous ne pouvez pas supprimer un étudiant avec des séances.',
          );

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

      return chai
        .request(app)
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
