import { expect } from 'chai';
import dotEnv from 'dotenv';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import db from '../../db/db';
import dbStudentsNewsletter from '../../db/studentsNewsletter';
import { studentsNewsletterTable } from '../../db/tables';
import { StudentNewsletter } from '../../types/StudentNewsletter';
import clean from '../helper/clean';

dotEnv.config();

describe('DB Newsletter Students', () => {
  afterEach(async () => {
    await clean.studentsNewsletter();
  });

  describe('insert', () => {
    it('should insert student with new email', async () => {
      const email = faker.internet.exampleEmail();
      await dbStudentsNewsletter.insert(email, null);

      const savedStudent = await db(studentsNewsletterTable).where('email', email).first();
      expect(savedStudent).exist;
      expect(savedStudent.letter).to.be.null;
      expect(savedStudent.appointment).to.be.null;
      expect(savedStudent.referral).to.be.null;
      expect(savedStudent.createdAt).to.exist;
      expect(savedStudent.updatedAt).to.be.null;
    });

    it('should insert student with new email & source', async () => {
      const email = faker.internet.exampleEmail();
      const source = 'instagram';
      await dbStudentsNewsletter.insert(email, source);

      const savedStudent = await db(studentsNewsletterTable).where('email', email).first();
      expect(savedStudent).exist;
      expect(savedStudent.letter).to.be.null;
      expect(savedStudent.appointment).to.be.null;
      expect(savedStudent.referral).to.be.null;
      expect(savedStudent.source).to.eql(source);
      expect(savedStudent.createdAt).to.exist;
      expect(savedStudent.updatedAt).to.be.null;
    });

    it('should ignore with already existing email', async () => {
      const email = faker.internet.exampleEmail();
      await dbStudentsNewsletter.insert(email, null);
      await dbStudentsNewsletter.insert(email, 'instagram');

      const savedStudent: StudentNewsletter[] = await db(studentsNewsletterTable).where('email', email);
      expect(savedStudent).has.length(1);
      expect(savedStudent[0].letter).to.be.null;
      expect(savedStudent[0].appointment).to.be.null;
      expect(savedStudent[0].referral).to.be.null;
      expect(savedStudent[0].source).to.be.null;
      expect(savedStudent[0].createdAt).to.be.not.null;
      expect(savedStudent[0].updatedAt).to.be.null;
    });
  });

  describe('update', () => {
    it('should update letter', async () => {
      const email = faker.internet.exampleEmail();
      await dbStudentsNewsletter.insert(email, null);
      const student = await db(studentsNewsletterTable).where('email', email).first();

      await dbStudentsNewsletter.updateById(student.id, {
        letter: true,
      });

      const savedStudent = await db(studentsNewsletterTable).where('email', email).first();
      expect(savedStudent.letter).to.be.true;
      expect(savedStudent.appointment).to.be.null;
      expect(savedStudent.referral).to.be.null;
      expect(savedStudent.updatedAt).to.be.not.null;
    });

    it('should update appointment', async () => {
      const email = faker.internet.exampleEmail();
      await dbStudentsNewsletter.insert(email, null);
      const student = await db(studentsNewsletterTable).where('email', email).first();

      await dbStudentsNewsletter.updateById(student.id, {
        appointment: false,
      });

      const savedStudent = await db(studentsNewsletterTable).where('email', email).first();
      expect(savedStudent.letter).to.be.null;
      expect(savedStudent.appointment).to.be.false;
      expect(savedStudent.referral).to.be.null;
      expect(savedStudent.updatedAt).to.be.not.null;
    });

    it('should update referral', async () => {
      const email = faker.internet.exampleEmail();
      await dbStudentsNewsletter.insert(email, null);
      const student = await db(studentsNewsletterTable).where('email', email).first();

      await dbStudentsNewsletter.updateById(student.id, {
        referral: 3,
      });

      const savedStudent = await db(studentsNewsletterTable).where('email', email).first();
      expect(savedStudent.letter).to.be.null;
      expect(savedStudent.appointment).to.be.null;
      expect(savedStudent.referral).to.equal(3);
      expect(savedStudent.updatedAt).to.be.not.null;
    });

    it('should ignore if id is unknown', async () => {
      const unknownId = uuidv4();
      await dbStudentsNewsletter.updateById(unknownId, {
        referral: 3,
      });
    });
  });
});
