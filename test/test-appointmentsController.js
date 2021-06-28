const chai = require('chai');
const sinon = require('sinon');
const { expect } = require('chai');
const app = require('../index');
const { default: clean } = require('./helper/clean');
const dbAppointments = require('../db/appointments');
const dbPatients = require('../db/patients');
const dbPsychologists = require('../db/psychologists');
const jwt = require('../utils/jwt');
const date = require('../utils/date');

describe('appointmentsController', () => {
  const dateOfBirth = date.parseDateForm('20/01/1980');

  describe('create appointment', () => {
    beforeEach(async () => {
      await clean.cleanAllPatients();
      await clean.cleanAllAppointments();
      return Promise.resolve();
    });

    afterEach(async () => {
      await clean.cleanAllPatients();
      await clean.cleanAllAppointments();
      return Promise.resolve();
    });

    it('should create appointment', async () => {
      const psy = await clean.insertOnePsy();
      const patient = await dbPatients.insertPatient(
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
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .send({
          patientId: patient.id,
          date: new Date('09/02/2021'),
        })
        .then(async (res) => {
          res.body.success.should.equal(true);
          res.body.message.should.equal('La séance du jeudi 2 septembre 2021 a bien été créée.');

          const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber);
          expect(appointmentArray).to.have.length(1);
          expect(appointmentArray[0].psychologistId).to.equal(psy.dossierNumber);

          return Promise.resolve();
        });
    });

    it('should not create appointment if patient id is not linked to psy id', async () => {
      const psy = await clean.insertOnePsy();
      const anotherPsy = await clean.insertOnePsy('another@email.fr');

      const patient = await dbPatients.insertPatient(
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
      .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .send({
          patientId: patient.id,
          date: new Date('09/02/2021'),
        })
        .then(async (res) => {
          res.body.success.should.equal(false);
          res.body.message.should.equal('Erreur. La séance n\'est pas créée. Pourriez-vous réessayer ?');

          // was not created because patient id is not linked to psy id
          const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber);
          expect(appointmentArray).to.have.length(0);

          return Promise.resolve();
        });
    });

    it('should not create appointment if user not logged in', async () => {
      const psy = await clean.insertOnePsy();
      const patient = await dbPatients.insertPatient(
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
        })
        .then(async (res) => {
          res.status.should.equal(401);

          // Appointment not created
          const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber);
          expect(appointmentArray).to.have.length(0);

          return Promise.resolve();
        });
    });
  });

  describe('create appointment - input validation', () => {
    let insertAppointmentStub;

    beforeEach(async () => {
      await clean.cleanAllPatients();
      insertAppointmentStub = sinon.stub(dbAppointments, 'insertAppointment')
        .returns(Promise.resolve());

      return Promise.resolve();
    });

    afterEach(async () => {
      await clean.cleanAllPatients();
      insertAppointmentStub.restore();
      return Promise.resolve();
    });

    it('should refuse invalid patientId', (done) => {
      chai.request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${jwt.getJwtTokenForUser('prenom.nom@beta.gouv.fr')}`)
        .send({
          patientId: 'not-a-uuid',
          date: new Date('09/02/2021'),
        })
        .end((err, res) => {
          res.body.success.should.equal(false);
          res.body.message.should.equal('Vous devez spécifier un patient pour la séance.');

          sinon.assert.notCalled(insertAppointmentStub);
          done();
        });
    });

    it('should refuse empty patientId', (done) => {
      chai.request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${jwt.getJwtTokenForUser('prenom.nom@beta.gouv.fr')}`)
        .send({
          // no patientId
          date: new Date('09/02/2021'),
        })
        .end((err, res) => {
          res.body.success.should.equal(false);
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
      .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .send({
          patientId: '052d3a16-7042-4f93-9fc0-2049e5fdae79',
          date: '09/02/2021',
        })
        .end((err, res) => {
          res.body.success.should.equal(false);
          res.body.message.should.equal('Vous devez spécifier une date pour la séance.');

          sinon.assert.notCalled(insertAppointmentStub);
          done();
        });
    });

    it('should refuse empty date', (done) => {
      chai.request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${jwt.getJwtTokenForUser('prenom.nom@beta.gouv.fr')}`)
        .send({
          patientId: '052d3a16-7042-4f93-9fc0-2049e5fdae79',
          // no date
        })
        .end((err, res) => {
          res.body.success.should.equal(false);
          res.body.message.should.equal('Vous devez spécifier une date pour la séance.');
          sinon.assert.notCalled(insertAppointmentStub);
          done();
        });
    });
  });

  describe('delete appointment', () => {
    beforeEach(async () => {
      await clean.cleanAllPatients();
      await clean.cleanAllAppointments();
      return Promise.resolve();
    });

    afterEach(async () => {
      await clean.cleanAllPatients();
      await clean.cleanAllAppointments();
      return Promise.resolve();
    });

    const makeAppointment = async (psychologistId) => {
      const psy = clean.getOnePsy();
      psy.dossierNumber = psychologistId;
      await dbPsychologists.savePsychologistInPG([psy]);
      // Insert an appointment and a patient
      const patient = await dbPatients.insertPatient(
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
      const appointment = await dbAppointments.insertAppointment(new Date(), patient.id, psychologistId);
      // Check appointment is inserted
      const appointmentArray = await dbAppointments.getAppointments(psychologistId);
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
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .then(async (res) => {
          res.body.success.should.equal(true);
          res.body.message.should.equal('La séance a bien été supprimée.');

          const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber);
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
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .then(async (res) => {
          res.body.success.should.equal(false);
          res.body.message.should.equal('Impossible de supprimer cette séance.');

          // Appointment is not deleted
          const appointmentArray = await dbAppointments.getAppointments(anotherPsyId);
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
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .then(async (res) => {
          res.body.success.should.equal(false);
          res.body.message.should.equal('Vous devez spécifier une séance à supprimer.');

          // Appointment is not deleted
          const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber);
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
          const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber);
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
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.dossierNumber)}`)
        .then(async (res) => {
          res.status.should.equal(404);

          const appointmentArray = await dbAppointments.getAppointments(psy.dossierNumber);
          expect(appointmentArray).to.have.length(1);

          return Promise.resolve();
        });
    });
  });
});
