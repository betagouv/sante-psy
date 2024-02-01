import chai, { expect } from 'chai';
import sinon from 'sinon';
import app from '../../index';
import clean from '../helper/clean';
import create from '../helper/create';
import dbAppointments from '../../db/appointments';
import dbPatients from '../../db/patients';
import dbPsychologists from '../../db/psychologists';
import cookie from '../../utils/cookie';
import { Psychologist } from '../../types/Psychologist';

describe('appointmentsController', () => {
  const dateOfBirth = new Date('1980/01/20');

  describe('create appointment', () => {
    let psy: Psychologist;
    before(async () => {
      psy = await create.insertOnePsy({ createdAt: new Date('2021-05-22') });
    });
    beforeEach(async () => {
      await clean.patients();
      await clean.appointments();
      return Promise.resolve();
    });

    afterEach(async () => {
      await clean.patients();
      await clean.appointments();
      return Promise.resolve();
    });

    it('should create appointments', async () => {
      const patient = await dbPatients.insert(
        'Ada',
        'Lovelace',
        '12345678901',
        '42',
        false,
        false,
        psy.dossierNumber,
        'Dr Docteur',
        'adresse du docteur',
        dateOfBirth,
      );

      return chai.request(app)
        .post('/api/appointments')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          patientId: patient.id,
          date: new Date('2021-06-27'),
          renewal: false,
        })
        .then(async (res) => {
          res.status.should.equal(200);
          res.body.message.should.equal('La séance du dimanche 27 juin 2021 a bien été créée.');

          const appointmentArray = await dbAppointments.getAll(psy.dossierNumber);
          expect(appointmentArray).to.have.length(1);
          expect(appointmentArray[0].psychologistId).to.equal(psy.dossierNumber);

          return Promise.resolve();
        });
    });

    it('should not create appointment if patient id is not linked to psy id', async () => {
      const psy = await create.insertOnePsy();
      const anotherPsy = await create.insertOnePsy({ personalEmail: 'another@email.fr' });

      const patient = await dbPatients.insert(
        'Ada',
        'Lovelace',
        '12345678901',
        '42',
        false,
        false,
        anotherPsy.dossierNumber,
        'Dr Docteur',
        'adresse du docteur',
        dateOfBirth,
      );

      return chai.request(app)
        .post('/api/appointments')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          patientId: patient.id,
          date: new Date('09/02/2021'),
          renewal: false,
        })
        .then(async (res) => {
          res.status.should.equal(500);
          res.body.message.should.equal('Erreur. La séance n\'est pas créée. Pourriez-vous réessayer ?');

          // was not created because patient id is not linked to psy id
          const appointmentArray = await dbAppointments.getAll(psy.dossierNumber);
          expect(appointmentArray).to.have.length(0);

          return Promise.resolve();
        });
    });

    it('should not create appointment if user not logged in', async () => {
      const psy = await create.insertOnePsy();
      const patient = await dbPatients.insert(
        'Ada',
        'Lovelace',
        '12345678901',
        '42',
        false,
        false,
        psy.dossierNumber,
        'Dr Docteur',
        'adresse du docteur',
        dateOfBirth,
      );

      return chai.request(app)
        .post('/api/appointments')
        .send({
          patientId: patient.id,
          date: new Date('09/02/2021'),
          renewal: false,
        })
        .then(async (res) => {
          res.status.should.equal(401);

          // Appointment not created
          const appointmentArray = await dbAppointments.getAll(psy.dossierNumber);
          expect(appointmentArray).to.have.length(0);

          return Promise.resolve();
        });
    });

    it('should not create appointment if diff in month > 4', async () => {
      const psy = await create.insertOnePsy();
      const patient = await dbPatients.insert(
        'Ada',
        'Lovelace',
        '12345678901',
        '42',
        false,
        false,
        psy.dossierNumber,
        'Dr Docteur',
        'adresse du docteur',
        dateOfBirth,
      );

      const todayDate = new Date();
      const newDatePlus5month = new Date(todayDate.setMonth(todayDate.getMonth() + 5));

      return chai.request(app)
        .post('/api/appointments')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          patientId: patient.id,
          date: newDatePlus5month,
          renewal: false,
        })
        .then(async (res) => {
          res.status.should.equal(400);
          res.body.message.should.equal('La date de la séance doit être dans moins de 4 mois');

          const appointmentArray = await dbAppointments.getAll(psy.dossierNumber);
          expect(appointmentArray).to.have.length(0);

          return Promise.resolve();
        });
    });

    it('should not create appointment if date before psychologist creation date', async () => {
      const beginningDate = new Date('2021-03-22');
      const psy = await create.insertOnePsy({ createdAt: beginningDate });
      const patient = await dbPatients.insert(
        'Ada',
        'Lovelace',
        '12345678901',
        '42',
        false,
        false,
        psy.dossierNumber,
        'Dr Docteur',
        'adresse du docteur',
        dateOfBirth,
      );

      const invalidDate = new Date(beginningDate.setMonth(beginningDate.getMonth() - 2));

      return chai.request(app)
        .post('/api/appointments')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          patientId: patient.id,
          date: invalidDate,
          renewal: false,
        })
        .then(async (res) => {
          res.status.should.equal(400);
          res.body.message.should.equal(
            "La date de la séance ne peut pas être antérieure à l'inscription au dispositif",
          );

          const appointmentArray = await dbAppointments.getAll(psy.dossierNumber);
          expect(appointmentArray).to.have.length(0);

          return Promise.resolve();
        });
    });
  });

  describe('create appointment - input validation', () => {
    let insertAppointmentStub;

    beforeEach(async () => {
      await clean.patients();
      insertAppointmentStub = sinon.stub(dbAppointments, 'insert')
        .returns(Promise.resolve());

      return Promise.resolve();
    });

    afterEach(async () => {
      await clean.patients();
      insertAppointmentStub.restore();
      return Promise.resolve();
    });

    it('should refuse invalid patientId', (done) => {
      chai.request(app)
        .post('/api/appointments')
        .set('Cookie', `token=${cookie.getJwtTokenForUser('prenom.nom@beta.gouv.fr', 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          patientId: 'not-a-uuid',
          date: new Date('09/02/2021'),
          renewal: false,
        })
        .end((err, res) => {
          res.status.should.equal(400);
          res.body.message.should.equal('Vous devez spécifier un patient pour la séance.');

          sinon.assert.notCalled(insertAppointmentStub);
          done();
        });
    });

    it('should refuse empty patientId', (done) => {
      chai.request(app)
        .post('/api/appointments')
        .set('Cookie', `token=${cookie.getJwtTokenForUser('prenom.nom@beta.gouv.fr', 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          // no patientId
          date: new Date('09/02/2021'),
          renewal: false,
        })
        .end((err, res) => {
          res.status.should.equal(400);
          res.body.message.should.equal('Vous devez spécifier un patient pour la séance.');

          sinon.assert.notCalled(insertAppointmentStub);
          done();
        });
    });

    it('should refuse invalid date', (done) => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      chai.request(app)
        .post('/api/appointments')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          patientId: '052d3a16-7042-4f93-9fc0-2049e5fdae79',
          date: '09/02/2021',
          renewal: false,
        })
        .end((err, res) => {
          res.status.should.equal(400);
          res.body.message.should.equal('Vous devez spécifier une date pour la séance.');

          sinon.assert.notCalled(insertAppointmentStub);
          done();
        });
    });

    it('should refuse empty date', (done) => {
      chai.request(app)
        .post('/api/appointments')
        .set('Cookie', `token=${cookie.getJwtTokenForUser('prenom.nom@beta.gouv.fr', 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          patientId: '052d3a16-7042-4f93-9fc0-2049e5fdae79',
          // no date
          renewal: false,
        })
        .end((err, res) => {
          res.status.should.equal(400);
          res.body.message.should.equal('Vous devez spécifier une date pour la séance.');
          sinon.assert.notCalled(insertAppointmentStub);
          done();
        });
    });
  });

  describe('delete appointment', () => {
    beforeEach(async () => {
      await clean.patients();
      await clean.appointments();
      return Promise.resolve();
    });

    afterEach(async () => {
      await clean.patients();
      await clean.appointments();
      return Promise.resolve();
    });

    const makeAppointment = async (psychologistId) => {
      const psy = create.getOnePsy();
      psy.dossierNumber = psychologistId;
      await dbPsychologists.upsertMany([psy]);
      // Insert an appointment and a patient
      const patient = await dbPatients.insert(
        'Ada',
        'Lovelace',
        '12345678901',
        '42',
        false,
        false,
        psychologistId,
        'Dr Docteur',
        'adresse du docteur',
        dateOfBirth,
      );
      const appointment = await dbAppointments.insert(new Date(), patient.id, psychologistId);
      // Check appointment is inserted
      const appointmentArray = await dbAppointments.getAll(psychologistId);
      expect(appointmentArray).to.have.length(1);
      return appointment;
    };

    it('should delete appointment', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };

      const appointment = await makeAppointment(psy.dossierNumber);

      return chai.request(app)
        .delete(`/api/appointments/${appointment.id}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(200);
          res.body.message.should.equal('La séance a bien été supprimée.');

          const appointmentArray = await dbAppointments.getAll(psy.dossierNumber);
          expect(appointmentArray).to.have.length(0);

          return Promise.resolve();
        });
    });

    it('should not delete appointment if it is not mine', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const anotherPsyId = 'ccb6f32b-8c55-4322-8ecc-556e6900b4ea';
      const appointment = await makeAppointment(anotherPsyId);

      return chai.request(app)
        .delete(`/api/appointments/${appointment.id}`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(404);
          res.body.message.should.equal('Impossible de supprimer cette séance.');

          // Appointment is not deleted
          const appointmentArray = await dbAppointments.getAll(anotherPsyId);
          expect(appointmentArray).to.have.length(1);

          return Promise.resolve();
        });
    });

    it('should refuse invalid appointmentId', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const appointment = await makeAppointment(psy.dossierNumber);

      return chai.request(app)
        .delete(`/api/appointments/${appointment.id}4`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(400);
          res.body.message.should.equal('Vous devez spécifier une séance à supprimer.');

          // Appointment is not deleted
          const appointmentArray = await dbAppointments.getAll(psy.dossierNumber);
          expect(appointmentArray).to.have.length(1);

          return Promise.resolve();
        });
    });

    it('should not delete appointment if user not logged in', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      const appointment = await makeAppointment(psy.dossierNumber);

      return chai.request(app)
        .delete(`/api/appointments/${appointment.id}4`)
        .then(async (res) => {
          res.status.should.equal(401);

          // Appointment is not deleted
          const appointmentArray = await dbAppointments.getAll(psy.dossierNumber);
          expect(appointmentArray).to.have.length(1);

          return Promise.resolve();
        });
    });

    it('should refuse empty appointmentId', async () => {
      const psy = {
        dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
        email: 'prenom.nom@beta.gouv.fr',
      };
      await makeAppointment(psy.dossierNumber);

      return chai.request(app)
        .delete('/api/appointments')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.status.should.equal(404);

          const appointmentArray = await dbAppointments.getAll(psy.dossierNumber);
          expect(appointmentArray).to.have.length(1);

          return Promise.resolve();
        });
    });
  });

  describe('get first appointments', () => {
    let psy: Psychologist;
    before(async () => {
      psy = await create.insertOnePsy({ createdAt: new Date('2021-05-22') });
    });
    beforeEach(async () => {
      await clean.patients();
      await clean.appointments();
      return Promise.resolve();
    });

    afterEach(async () => {
      await clean.patients();
      await clean.appointments();
      return Promise.resolve();
    });

    it('should get first appointments after january 1st 2024', async () => {
      const patient1 = create.getOnePatient(0, { psychologistId: psy.dossierNumber });
      const dbPatient1 = await dbPatients.insert(
        patient1.firstNames,
        patient1.lastName,
        patient1.INE,
        patient1.institutionName,
        patient1.isStudentStatusVerified,
        patient1.hasPrescription,
        psy.dossierNumber,
        patient1.doctorName,
        patient1.doctorAddress,
        patient1.dateOfBirth,
      );

      const appointment = await dbAppointments.insert(new Date('2024-01-03'), dbPatient1.id, psy.dossierNumber);

      return chai.request(app)
      .get('/api/appointments/first')
      .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
      .set('xsrf-token', 'randomXSRFToken')
      .then(async (res) => {
        expect(res.body).to.have.length(1);
        expect(new Date(res.body[0].appointmentDate)).to.eql(appointment.appointmentDate);
        return Promise.resolve();
      });
    });

    it('shouldn\'t get first appointments before january 1st 2024', async () => {
      const patient1 = create.getOnePatient(0, { psychologistId: psy.dossierNumber });
      const dbPatient1 = await dbPatients.insert(
        patient1.firstNames,
        patient1.lastName,
        patient1.INE,
        patient1.institutionName,
        patient1.isStudentStatusVerified,
        patient1.hasPrescription,
        psy.dossierNumber,
        patient1.doctorName,
        patient1.doctorAddress,
        patient1.dateOfBirth,
      );

      await dbAppointments.insert(new Date('2023-12-03'), dbPatient1.id, psy.dossierNumber);

      return chai.request(app)
      .get('/api/appointments/first')
      .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
      .set('xsrf-token', 'randomXSRFToken')
      .then(async (res) => {
        expect(res.body).to.have.length(0);
        return Promise.resolve();
      });
    });

    it(
      'shouldn\'t get first appointment after January 1st 2024, if already had one at the start of this cycle',
      async () => {
        const patient1 = create.getOnePatient(0, { psychologistId: psy.dossierNumber });
        const dbPatient1 = await dbPatients.insert(
          patient1.firstNames,
          patient1.lastName,
          patient1.INE,
          patient1.institutionName,
          patient1.isStudentStatusVerified,
          patient1.hasPrescription,
          psy.dossierNumber,
          patient1.doctorName,
          patient1.doctorAddress,
          patient1.dateOfBirth,
        );

        await dbAppointments.insert(new Date('2023-12-03'), dbPatient1.id, psy.dossierNumber);
        await dbAppointments.insert(new Date('2024-01-03'), dbPatient1.id, psy.dossierNumber);

        return chai.request(app)
      .get('/api/appointments/first')
      .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
      .set('xsrf-token', 'randomXSRFToken')
      .then(async (res) => {
        expect(res.body).to.have.length(0);
        return Promise.resolve();
      });
      },
    );

    it('should get first appointments on next scolar cycle after january 1st 2024', async () => {
      const patient1 = create.getOnePatient(0, { psychologistId: psy.dossierNumber });
      const dbPatient1 = await dbPatients.insert(
        patient1.firstNames,
        patient1.lastName,
        patient1.INE,
        patient1.institutionName,
        patient1.isStudentStatusVerified,
        patient1.hasPrescription,
        psy.dossierNumber,
        patient1.doctorName,
        patient1.doctorAddress,
        patient1.dateOfBirth,
      );

      const appointment1 = await dbAppointments.insert(new Date('2024-01-03'), dbPatient1.id, psy.dossierNumber);
      const appointment2 = await dbAppointments.insert(new Date('2024-09-03'), dbPatient1.id, psy.dossierNumber);

      return chai.request(app)
      .get('/api/appointments/first')
      .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
      .set('xsrf-token', 'randomXSRFToken')
      .then(async (res) => {
        expect(res.body).to.have.length(2);
        expect(new Date(res.body[0].appointmentDate)).to.eql(appointment1.appointmentDate);
        expect(new Date(res.body[1].appointmentDate)).to.eql(appointment2.appointmentDate);
        return Promise.resolve();
      });
    });
  });

  describe('get appointments with badges', () => {
    let psy: Psychologist;
    before(async () => {
      psy = await create.insertOnePsy({ createdAt: new Date('2021-05-22') });
    });
    beforeEach(async () => {
      await clean.patients();
      await clean.appointments();
      return Promise.resolve();
    });

    afterEach(async () => {
      await clean.patients();
      await clean.appointments();
      return Promise.resolve();
    });

    it('should have appointment with a specific badge for the 1st appointment', async () => {
      const patient1 = create.getOnePatient(0, { psychologistId: psy.dossierNumber });
      const dbPatient1 = await dbPatients.insert(
        patient1.firstNames,
        patient1.lastName,
        patient1.INE,
        patient1.institutionName,
        patient1.isStudentStatusVerified,
        patient1.hasPrescription,
        psy.dossierNumber,
        patient1.doctorName,
        patient1.doctorAddress,
        patient1.dateOfBirth,
      );

      await dbAppointments.insert(new Date('2023-11-03'), dbPatient1.id, psy.dossierNumber);

      return chai.request(app)
      .get('/api/appointments')
      .query({ includeBadges: true })
      .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
      .set('xsrf-token', 'randomXSRFToken')
      .then(async (res) => {
        expect(res.body).to.have.length(1);
        expect(res.body[0].badge).to.eql('first');
        return Promise.resolve();
      });
    });

    it('should have appointment with a specific badge on the 8th appointment date', async () => {
      const patient1 = create.getOnePatient(0, { psychologistId: psy.dossierNumber });
      const dbPatient1 = await dbPatients.insert(
        patient1.firstNames,
        patient1.lastName,
        patient1.INE,
        patient1.institutionName,
        patient1.isStudentStatusVerified,
        patient1.hasPrescription,
        psy.dossierNumber,
        patient1.doctorName,
        patient1.doctorAddress,
        patient1.dateOfBirth,
      );

      await dbAppointments.insert(new Date('2023-09-03'), dbPatient1.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2023-10-03'), dbPatient1.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2023-11-03'), dbPatient1.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2023-12-03'), dbPatient1.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2024-01-03'), dbPatient1.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2024-02-03'), dbPatient1.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2024-03-03'), dbPatient1.id, psy.dossierNumber);
      const appointmentBadgeMax = await dbAppointments.insert(new Date('2024-04-03'), dbPatient1.id, psy.dossierNumber);

      return chai.request(app)
      .get('/api/appointments')
      .query({ includeBadges: true })
      .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
      .set('xsrf-token', 'randomXSRFToken')
      .then(async (res) => {
        expect(res.body).to.have.length(8);
        expect(new Date(res.body[0].appointmentDate)).to.eql(appointmentBadgeMax.appointmentDate);
        expect(res.body[0].badge).to.eql('max');
        return Promise.resolve();
      });
    });

    it('should have appointment with a specific badge when excedeed eight appointments', async () => {
      const patient1 = create.getOnePatient(0, { psychologistId: psy.dossierNumber });
      const dbPatient1 = await dbPatients.insert(
        patient1.firstNames,
        patient1.lastName,
        patient1.INE,
        patient1.institutionName,
        patient1.isStudentStatusVerified,
        patient1.hasPrescription,
        psy.dossierNumber,
        patient1.doctorName,
        patient1.doctorAddress,
        patient1.dateOfBirth,
      );

      await dbAppointments.insert(new Date('2023-09-03'), dbPatient1.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2023-10-03'), dbPatient1.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2023-11-03'), dbPatient1.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2023-12-03'), dbPatient1.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2024-01-03'), dbPatient1.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2024-02-03'), dbPatient1.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2024-03-03'), dbPatient1.id, psy.dossierNumber);
      await dbAppointments.insert(new Date('2024-04-03'), dbPatient1.id, psy.dossierNumber);
      const appointment9 = await dbAppointments.insert(new Date('2024-05-03'), dbPatient1.id, psy.dossierNumber);
      const appointment10 = await dbAppointments.insert(new Date('2024-06-03'), dbPatient1.id, psy.dossierNumber);

      return chai.request(app)
      .get('/api/appointments')
      .query({ includeBadges: true })
      .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
      .set('xsrf-token', 'randomXSRFToken')
      .then(async (res) => {
        expect(res.body).to.have.length(10);
        expect(new Date(res.body[1].appointmentDate)).to.eql(appointment9.appointmentDate);
        expect(new Date(res.body[0].appointmentDate)).to.eql(appointment10.appointmentDate);
        expect(res.body[1].badge).to.eql('exceeded');
        expect(res.body[0].badge).to.eql('exceeded');
        return Promise.resolve();
      });
    });
  });
});
