import dbStudents from '../db/students';
import dbLoginToken from '../db/loginToken';
import sendStudentMailTemplate from './sendStudentMailTemplate';
import loginInformations from './loginInformations';
import date from '../utils/date';

const studentHasAccount = async (email: string): Promise<boolean> => {
  const student = await dbStudents.getByEmail?.(email);
  return Boolean(student);
};

const sendStudentSecondStepInvitation = async (
  email: string,
  template: string,
  title: string,
): Promise<void> => {
  const token = loginInformations.generateToken(32);
  const expiresAt = date.getDatePlusFourtyEightHours();

  await dbLoginToken.upsert(token, email, expiresAt, 'student');

  await sendStudentMailTemplate(
    email,
    loginInformations.generateStudentSignInStepTwoUrl(),
    token,
    template,
    title,
  );
};

const inviteNewStudentToCreateAccount = async (
  email?: string,
  template = 'studentSignInValidation',
  title = 'Étape 2 de votre inscription',
): Promise<void> => {
  if (!email) return;

  const alreadyExists = await studentHasAccount(email);
  if (alreadyExists) return;

  await sendStudentSecondStepInvitation(email, template, title);
};

export default {
  inviteNewStudentToCreateAccount,
};
