// import { expect } from 'chai';
// import sinon from 'sinon';
// import * as dbModule from '../../db/db';
// import studentsDb from '../../db/students';
// import { studentsTable } from '../../db/tables';

// describe.only('DB Students', () => {
//   let dbStub;

//   beforeEach(() => {
//     dbStub = sinon.stub();
//     sinon.stub(dbModule, 'default').value(dbStub);
//   });

//   afterEach(() => {
//     sinon.restore();
//   });

//   describe('signIn', () => {
//     it('should return alreadyRegistered if email AND ine match one existing student', async () => {
//       const email = 'test@student.fr';
//       const ine = '1234567890A';
//       const firstNames = 'Donia';

//       dbStub.withArgs(studentsTable).returns({
//         where: () => ({
//           first: () => Promise.resolve({ email, ine }),
//         }),
//       });

//       const result = await studentsDb.signIn(email, ine, firstNames);

//       expect(result.status).to.equal('alreadyRegistered');
//     });

//     it('should return conflict if email OR ine already exists', async () => {
//       const email = 'conflict@student.fr';
//       const ine = '1234567890B';
//       const firstNames = 'Ava';

//       dbStub.withArgs(studentsTable).returns({
//         where: () => ({
//           first: () => Promise.resolve(null),
//         }),
//         orWhere: () => ({
//           limit: () => Promise.resolve([{ email }]),
//         }),
//       });

//       const result = await studentsDb.signIn(email, ine, firstNames);

//       expect(result.status).to.equal('conflict');
//     });

//     it('should create student and return created', async () => {
//       const email = 'create@student.fr';
//       const ine = '1234567890C';
//       const firstNames = 'Sandy';

//       dbStub.withArgs(studentsTable).returns({
//         where: () => ({
//           first: () => Promise.resolve(null),
//         }),
//         orWhere: () => ({
//           limit: () => Promise.resolve([]),
//         }),
//         insert: () => ({
//           returning: () => Promise.resolve([{ email, ine }]),
//         }),
//       });

//       const result = await studentsDb.signIn(email, ine, firstNames);

//       expect(result.status).to.equal('created');
//     });

//     it('should throw error if DB crashes', async () => {
//       const email = 'err@test.fr';
//       const ine = '1234567890D';
//       const firstNames = 'Crash Test';

//       dbStub.withArgs(studentsTable).throws(new Error('DB crash'));

//       try {
//         await studentsDb.signIn(email, ine, firstNames);
//         expect.fail('Should throw');
//       } catch (err) {
//         expect(err.message).to.equal("Erreur lors de la création de l'étudiant");
//       }
//     });
//   });

//   describe('getStudentById', () => {
//     it('should return student if exists', async () => {
//       const studentId = '9c883409-664e-4aeb-b425-a30b5fbbe43a';

//       dbStub.withArgs(studentsTable).returns({
//         where: () => ({
//           first: () => Promise.resolve({ id: studentId, email: 'exist@test.fr' }),
//         }),
//       });

//       const result = await studentsDb.getStudentById(studentId);

//       expect(result.id).to.equal(studentId);
//     });

//     it('should return undefined if student does not exist', async () => {
//       const studentId = 'unknown';

//       dbStub.withArgs(studentsTable).returns({
//         where: () => ({
//           first: () => Promise.resolve(undefined),
//         }),
//       });

//       const result = await studentsDb.getStudentById(studentId);

//       expect(result).to.be.undefined;
//     });

//     it('should throw on DB error', async () => {
//       const studentId = 'err';

//       dbStub.withArgs(studentsTable).throws(new Error('DB failed'));

//       try {
//         await studentsDb.getStudentById(studentId);
//         expect.fail('Should throw');
//       } catch (err) {
//         expect(err.message).to.equal("Impossible de récupérer l'étudiant");
//       }
//     });
//   });

//   describe('getStudentByEmail', () => {
//     it('should return student if exists', async () => {
//       const email = 'test@test.fr';

//       dbStub.withArgs(studentsTable).returns({
//         where: () => ({
//           first: () => Promise.resolve({ email }),
//         }),
//       });

//       const result = await studentsDb.getStudentByEmail(email);

//       expect(result.email).to.equal(email);
//     });

//     it('should return undefined if not exists', async () => {
//       const email = 'non@test.fr';

//       dbStub.withArgs(studentsTable).returns({
//         where: () => ({
//           first: () => Promise.resolve(undefined),
//         }),
//       });

//       const result = await studentsDb.getStudentByEmail(email);

//       expect(result).to.be.undefined;
//     });

//     it('should throw on DB error', async () => {
//       const email = 'err@test.fr';

//       dbStub.withArgs(studentsTable).throws(new Error('DB fail'));

//       try {
//         await studentsDb.getStudentByEmail(email);
//         expect.fail('should throw');
//       } catch (err) {
//         expect(err.message).to.equal('Une erreur est survenue.');
//       }
//     });
//   });
// });
