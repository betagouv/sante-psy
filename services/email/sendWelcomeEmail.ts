import loginController from '../../controllers/loginController';
import CustomError from '../../utils/CustomError';
import loginInformations from '../loginInformations';
import sendStudentMailTemplate from '../sendStudentMailTemplate';

export const sendWelcomeMail = async (email: string): Promise<void> => {
  try {
    const loginUrl = loginInformations.generateLoginUrl();
    const token = await loginController.getOrCreateToken(email, 'student', 2);
    await sendStudentMailTemplate(
      email,
      loginUrl,
      token,
      'studentWelcome',
      'Bienvenue !',
    );
    console.log(`--> welcome email sent to ${email.slice(0, 5)}...`);
  } catch (err) {
    console.error(err);
    throw err instanceof CustomError
      ? err
      : new CustomError("Erreur lors de l'envoi du mail de bienvenue", 500);
  }
};
