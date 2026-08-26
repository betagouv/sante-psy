/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import dotenv from 'dotenv';
import db from '../db/db';
import { studentsTable } from '../db/tables';
import verifyINE from '../services/inesApi';
import { sendWelcomeMail } from '../services/email/sendWelcomeEmail';

dotenv.config();

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const checkIneStudents = async (n = 500): Promise<void> => {
  const studentsToCheck = await db(studentsTable)
    .whereNull('api_ines_check')
    .orderBy('createdAt', 'desc')
    .limit(n)
    .select();

  for (const student of studentsToCheck) {
    try {
      const result = await verifyINE(student.ine, student.dateOfBirth);

      const checkBefore = student.api_ines_check;

      let apiInesCheck: boolean | null;
      if (result.status === 'found') {
        apiInesCheck = true;
      } else if (result.status === 'not_found') {
        apiInesCheck = false;
      } else {
        apiInesCheck = null;
        console.error(
          `Technical error for student ${student.id}`,
          result.error,
        );
      }

      const checkAfter = apiInesCheck;

      await db(studentsTable)
        .where({ id: student.id })
        .update({ api_ines_check: apiInesCheck });

      if (checkAfter && !checkBefore) {
        sendWelcomeMail(student.email);
      }

      console.log(
        `+++ cron api ines student=${student.id}: ${JSON.stringify(result.status)}`,
      );
    } catch (err) {
      console.error(
        `--- cron api ines - error - Failed to verify student ${student.id}`,
        err,
      );
    }

    await sleep(100);
  }
  console.log('Done !');
};
