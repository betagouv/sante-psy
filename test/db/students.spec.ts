import { expect } from 'chai';
import dbStudents from '../../db/students';
import db from '../../db/db';
import clean from '../helper/clean';
import { studentsTable } from '../../db/tables';
import date from '../../utils/date';

describe.only('DB Students', () => {
  const email = 'donia@test.com';
  const email2 = 'ana@test.com';
  const firstNames = 'Donia';
  const lastName = 'Test';
  const dateOfBirth = new Date('2000-01-01');
  const ine = '1234567890A';
  const ine2 = 'A0987654321';

  async function studentExists(email: string) {
    const student = await dbStudents.getByEmail(email);
    return !!student;
  }

  beforeEach(async () => {
    await clean.students();
  });

  afterEach(async () => {
    await clean.students();
  });

  describe('checkDuplicates', () => {
    it('should return "available" when no duplicate exists', async () => {
      const result = await dbStudents.checkDuplicates(email, ine);

      expect(result.status).equal('available');
    });

    it('should return "alreadyRegistered" when same email + ine already exist', async () => {
      await db(studentsTable).insert({
        email,
        ine,
        firstNames,
        lastName,
        dateOfBirth,
        createdAt: date.now(),
      });

      const result = await dbStudents.checkDuplicates(email, ine);

      expect(result.status).equal('alreadyRegistered');
    });

    it('should return "conflict" when email exists but ine differs', async () => {
      await db(studentsTable).insert({
        email,
        ine,
        firstNames,
        lastName,
        dateOfBirth,
        createdAt: date.now(),
      });

      const result = await dbStudents.checkDuplicates(email, ine2);

      expect(result.status).equal('conflict');
    });

    it('should return "conflict" when ine exists but email differs', async () => {
      await db(studentsTable).insert({
        email,
        ine,
        firstNames,
        lastName,
        dateOfBirth,
        createdAt: date.now(),
      });

      const result = await dbStudents.checkDuplicates(email2, ine);

      expect(result.status).equal('conflict');
    });
  });

  describe('create', () => {
    it('should create a student and return the student object', async () => {
      const student = await dbStudents.create(
        email,
        ine,
        firstNames,
        lastName,
        dateOfBirth,
      );

      expect(student).to.have.property('email', email);
      expect(student).to.have.property('ine', ine);
      expect(student).to.have.property('firstNames', firstNames);
      expect(student).to.have.property('lastName', lastName);
      expect(student).to.have.property('id');

      const exists = await studentExists(email);
      expect(exists).equal(true);
    });

    it('should throw an error if trying to create duplicate student', async () => {
      await db(studentsTable).insert({
        email,
        ine,
        firstNames,
        lastName,
        dateOfBirth,
        createdAt: date.now(),
      });

      try {
        await dbStudents.create(email, ine, firstNames, lastName, dateOfBirth);
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.exist;
      }
    });
  });

  describe('getById', () => {
    it('should retrieve a student by id', async () => {
      const inserted = await db(studentsTable)
        .insert({
          email,
          ine,
          firstNames,
          lastName,
          dateOfBirth,
          createdAt: date.now(),
        })
        .returning('*');

      const student = await dbStudents.getById(inserted[0].id);

      expect(student).to.not.be.undefined;
      expect(student.email).equal(email);
      expect(student.ine).equal(ine);
    });
  });

  describe('getByEmail', () => {
    it('should retrieve a student by email', async () => {
      await db(studentsTable).insert({
        email,
        ine,
        firstNames,
        lastName,
        dateOfBirth,
        createdAt: date.now(),
      });

      const student = await dbStudents.getByEmail(email);

      expect(student).to.not.be.undefined;
      expect(student.email).equal(email);
    });

    it('should return undefined if student email does not exist', async () => {
      const student = await dbStudents.getByEmail('doesnotexist@test.fr');
      expect(student).to.be.undefined;
    });
  });
});
