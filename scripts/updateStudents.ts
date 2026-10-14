/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import db from '../db/db';
import { studentsTable } from '../db/tables';
import verifyINE from '../services/inesApi';

interface StudentEntry {
  studentId: string;
  INE: string;
  DoB: string;
  firstName: string;
  lastName: string;
  email: string;
}

const workStudentEntry = async (studentEntry: StudentEntry): Promise<void> => {
  const { studentId, firstName, lastName, email, INE, DoB } = studentEntry;

  if (!studentEntry) {
    console.log('-- student id not given');
    return;
  }

  const student = await db(studentsTable).where('id', studentId).first();

  if (!student) {
    console.log('-- student not found');
    return;
  }

  if (firstName) {
    console.log(`-- student ${studentId} update firstName = ${firstName}`);
    await db(studentsTable).where({ id: studentId }).update({
      firstNames: firstName,
    });
  }

  if (lastName) {
    console.log(`-- student ${studentId} update lastName = ${lastName}`);
    await db(studentsTable).where({ id: studentId }).update({
      lastName,
    });
  }

  if (email) {
    console.log(`-- student ${studentId} update email = ${email}`);
    await db(studentsTable).where({ id: studentId }).update({
      email,
    });
  }

  if (DoB) {
    console.log(`-- student ${studentId} update DoB = ${DoB}`);
    await db(studentsTable)
      .where({ id: studentId })
      .update({
        dateOfBirth: new Date(DoB),
      });
  }

  if (INE) {
    console.log(`-- student ${studentId} update INE = ${INE}`);
    await db(studentsTable).where({ id: studentId }).update({
      ine: INE,
    });
  }

  if (DoB || INE) {
    const useIne = INE || student.ine;
    const useDob = DoB ? new Date(DoB) : student.dateOfBirth;
    const ineCheck = (await verifyINE(useIne, useDob)).status === 'found';
    console.log(
      `-- student ${studentId} update apiInesCheck = ${JSON.stringify(ineCheck)}`,
    );
    await db(studentsTable).where({ id: studentId }).update({
      api_ines_check: ineCheck,
    });
  }
};

const updateStudents = async (
  studentEntries: StudentEntry[],
): Promise<void> => {
  console.log(`- update ${studentEntries.length} student entries`);
  for (const studentEntry of studentEntries) {
    await workStudentEntry(studentEntry);
  }
};

// format
const studentEntries = [] as StudentEntry[];

updateStudents(studentEntries).catch((err) => {
  console.error('Fatal error while updating students:', err);
  process.exit(1);
});
