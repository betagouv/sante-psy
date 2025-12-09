import { expect } from 'chai';
import dbStudents from '../../db/students';
import db from '../../db/db';
import clean from '../helper/clean';
import { studentsTable } from '../../db/tables';
import date from '../../utils/date';

describe('DB Students', () => {
  const email = 'donia@test.com';
  const email2 = 'ana@test.com';
  const firstNames = 'Donia';
  const ine = '1234567890A';
  const ine2 = 'A0987654321';

  async function studentExists(email: string) {
    const student = await dbStudents.getStudentByEmail(email);
    return !!student;
  }

  beforeEach(async () => {
    await clean.students();
  });

  afterEach(async () => {
    await clean.students();
  });

  describe('signIn', () => {
    it('should create a student and return status "created"', async () => {
      const result = await dbStudents.signIn(email, ine, firstNames);

      expect(result.status).equal('created');
      expect(result).to.have.property('email', email);

      const exists = await studentExists(email);
      expect(exists).equal(true);
    });

    it('should return "alreadyRegistered" when same email + ine already exist', async () => {
      await db(studentsTable).insert({
        email,
        ine,
        firstNames,
        createdAt: date.now(),
      });

      const result = await dbStudents.signIn(email, ine, firstNames);

      expect(result.status).equal('alreadyRegistered');
      expect(result).to.have.property('email', email);
    });

    it('should return "conflict" when email exists but ine differs', async () => {
      await db(studentsTable).insert({
        email,
        ine,
        firstNames,
        createdAt: date.now(),
      });

      const result = await dbStudents.signIn(email, ine2, firstNames);

      expect(result.status).equal('conflict');
    });

    it('should return "conflict" when ine exists but email differs', async () => {
      await db(studentsTable).insert({
        email,
        ine,
        firstNames,
        createdAt: date.now(),
      });

      const result = await dbStudents.signIn(email2, ine, firstNames);

      expect(result.status).equal('conflict');
    });
  });

  describe('getStudentById', () => {
    it('should retrieve a student by id', async () => {
      const inserted = await db(studentsTable)
        .insert({
          email,
          ine,
          firstNames,
          createdAt: date.now(),
        })
        .returning('*');

      const student = await dbStudents.getStudentById(inserted[0].id);

      expect(student).to.not.be.undefined;
      expect(student.email).equal(email);
      expect(student.ine).equal(ine);
    });
  });

  describe('getStudentByEmail', () => {
    it('should retrieve a student by email', async () => {
      await db(studentsTable).insert({
        email,
        ine,
        firstNames,
        createdAt: date.now(),
      });

      const student = await dbStudents.getStudentByEmail(email);

      expect(student).to.not.be.undefined;
      expect(student.email).equal(email);
    });

    it('should return undefined if student email does not exist', async () => {
      const student = await dbStudents.getStudentByEmail('doesnotexist@test.fr');
      expect(student).to.be.undefined;
    });
  });
});
