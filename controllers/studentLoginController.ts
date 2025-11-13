import dbStudentLoginToken from '../db/studentLoginToken';
import logs from '../utils/logs';
import CustomError from '../utils/CustomError';
import loginInformations from '../services/loginInformations';
import db from '../db/db';
import { studentsTable } from '../db/tables';
import date from '../utils/date';
import sendStudentMailTemplate from './studentMailController';

const sendStudentLoginMail = async (email: string, ine: string): Promise<void> => {
  try {
    const loginUrl = loginInformations.generateLoginUrl();
    const token = loginInformations.generateToken(32);
    let expiredAt = date.getDatePlusOneHour();

    console.log(`User with ${logs.hash(email)} asked for a login link`);
    const existingStudent = await db(studentsTable).where({ email, ine }).first();
    if (!existingStudent) throw new CustomError('Étudiant introuvable', 404);

    const template = existingStudent.validated
      ? 'studentLogin'
      : 'studentSignInValidation';

    if (!existingStudent.validated) expiredAt = date.getDateInAWeek();

    const existingToken = await dbStudentLoginToken.getStudentByEmail(email);
    if (existingToken) {
      const newExpiredAt = date.getDateInAWeek();
      await dbStudentLoginToken.update(email, newExpiredAt);
      console.log(`Token expiry updated for ${logs.hash(email)}`);
    } else {
      await dbStudentLoginToken.insert(token, email, expiredAt);
      console.log(`Login token created for ${logs.hash(email)}`);
    }

    await sendStudentMailTemplate(email, loginUrl, token, template);
  } catch (err) {
    console.error(err);
    throw err instanceof CustomError ? err : new CustomError('Erreur lors de l’envoi du mail de connexion', 500);
  }
};

export default sendStudentLoginMail;
