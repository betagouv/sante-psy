// import sinon from 'sinon';
// import chai from 'chai';
// import { v4 as uuidv4 } from 'uuid';
// import app from '../../index';
// import dbStudents from '../../db/students';
// import dbLoginToken from '../../db/loginToken';
// import cookie from '../../utils/cookie';
// import create from '../helper/create';
// import sendEmail from '../../utils/email';

// describe('studentLoginController', async () => {
//   describe('studentLogin', () => {
//     const token = 'validToken123';
//     const email = 'donia@test.com';
//     let getStudentByTokenStub;
//     let deleteTokenStub;
//     let getByEmailStub;
//     let createAndSetJwtCookieStub;

//     beforeEach(async () => {
//       getStudentByTokenStub = sinon.stub(dbLoginToken, 'getByToken');
//       deleteTokenStub = sinon.stub(dbLoginToken, 'delete');
//       getByEmailStub = sinon.stub(dbStudents, 'getByEmail');
//       createAndSetJwtCookieStub = sinon.stub(cookie, 'createAndSetJwtCookie');
//     });

//     afterEach((done) => {
//       getStudentByTokenStub.restore();
//       deleteTokenStub.restore();
//       getByEmailStub.restore();
//       createAndSetJwtCookieStub.restore();
//       done();
//     });

//     it('should login a student with a valid token', (done) => {
//       getStudentByTokenStub.returns(Promise.resolve({ token, email }));
//       getByEmailStub.returns(Promise.resolve({ id: uuidv4(), email }));

//       chai
//         .request(app)
//         .post('/api/student/login')
//         .send({ token })
//         .end((err, res) => {
//           sinon.assert.called(getStudentByTokenStub);
//           sinon.assert.called(deleteTokenStub);
//           sinon.assert.called(getByEmailStub);
//           sinon.assert.called(createAndSetJwtCookieStub);
//           res.status.should.equal(200);
//           res.body.should.have.property('xsrfToken');
//           done();
//         });
//     });

//     it('should NOT login a student with an invalid token', (done) => {
//       getStudentByTokenStub.returns(Promise.resolve(undefined));

//       chai
//         .request(app)
//         .post('/api/student/login')
//         .send({ token: 'invalidToken' })
//         .end((err, res) => {
//           sinon.assert.called(getStudentByTokenStub);
//           sinon.assert.notCalled(deleteTokenStub);
//           sinon.assert.notCalled(getByEmailStub);
//           sinon.assert.notCalled(createAndSetJwtCookieStub);
//           res.status.should.equal(401);
//           res.body.message.should.equal(
//             'Ce lien est invalide ou expiré. Indiquez votre email ci-dessous pour en avoir un nouveau.'
//           );
//           done();
//         });
//     });
//   });

//   describe('sendStudentMail', () => {
//     const email = 'student@example.com';
//     let getByEmailStub;
//     let sendStudentLoginEmailStub;
//     let saveStudentTokenStub;

//     beforeEach(async () => {
//       getByEmailStub = sinon.stub(dbStudents, 'getByEmail');
//       sendStudentLoginEmailStub = sinon.stub(sendEmail, 'default').returns(Promise.resolve());
//       saveStudentTokenStub = sinon.stub(dbLoginToken, 'insert').returns(Promise.resolve());
//     });

//     afterEach((done) => {
//       getByEmailStub.restore();
//       sendStudentLoginEmailStub.restore();
//       saveStudentTokenStub.restore();
//       done();
//     });

//     it('should send a login email if student is registered', (done) => {
//       getByEmailStub.returns(Promise.resolve({ id: uuidv4(), email }));

//       chai
//         .request(app)
//         .post('/api/auth/sendLoginMail')
//         .send({ email })
//         .end((err, res) => {
//           sinon.assert.called(getByEmailStub);
//           sinon.assert.called(sendStudentLoginEmailStub);
//           sinon.assert.called(saveStudentTokenStub);
//           res.status.should.equal(200);
//           done();
//         });
//     });

//     it('should NOT send an email if student is not registered', (done) => {
//       getByEmailStub.returns(Promise.resolve(undefined));

//       chai
//         .request(app)
//         .post('/api/auth/sendLoginMail')
//         .send({ email: 'unknown@example.com' })
//         .end((err, res) => {
//           sinon.assert.called(getByEmailStub);
//           sinon.assert.notCalled(sendStudentLoginEmailStub);
//           sinon.assert.notCalled(saveStudentTokenStub);
//           res.status.should.equal(200);
//           done();
//         });
//     });
//   });

//   // describe('connectedStudent', () => {
//   //   it('should return student information if connected', async () => {
//   //     const student = create.getOneStudent();
//   //     await dbStudents.([student]);

//   //     return chai
//   //       .request(app)
//   //       .get('/api/student/connected')
//   //       .set('Cookie', `token=${cookie.getJwtTokenForUser(student.id, 'randomXSRFToken')}`)
//   //       .set('xsrf-token', 'randomXSRFToken')
//   //       .then((res) => {
//   //         res.body.should.have.all.keys(
//   //           'id',
//   //           'firstNames',
//   //           'ine',
//   //           'email',
//   //           'createdAt',
//   //         );
//   //         res.body.id.should.equal(student.id);
//   //         res.body.email.should.equal(student.email);
//   //       });
//   //   });
//   });
// });
