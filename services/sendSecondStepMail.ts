import dbStudents from '../db/students';
import sendStudentMailTemplate from './sendStudentMailTemplate';
import loginInformations from './loginInformations';
import loginController from '../controllers/loginController';

const studentHasAccount = async (email: string): Promise<boolean> => {
  const student = await dbStudents.getByEmail?.(email);
  return Boolean(student);
};

const sendStudentSecondStepInvitation = async (
  email: string,
  template: string,
  title: string,
): Promise<void> => {
  const token = await loginController.getOrCreateToken(email, 'student', 48);
  console.log(
    `--login (via signin) - new student - token created for ${email} token=${token.slice(0, 6)}...`,
  );
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
  if (email.toLowerCase().includes('santepsyetudiant')) return;

  const alreadyExists = await studentHasAccount(email);
  if (alreadyExists) return;

  await sendStudentSecondStepInvitation(email, template, title);
};

export default {
  inviteNewStudentToCreateAccount,
};
