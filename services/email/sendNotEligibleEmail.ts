import ejs from 'ejs';
import send from '../../utils/email';
import CustomError from '../../utils/CustomError';
import config from '../../utils/config';

export const sendNotEligibleEmail = async (email: string): Promise<void> => {
  try {
    const html = await ejs.renderFile(`./views/emails/studentNotEligible.ejs`);
    await send(
      email,
      `${config.appName} - Tu n’es pas éligible au dispositif Santé Psy Etudiant`,
      html,
    );
  } catch (err) {
    console.error(err);
    throw err instanceof CustomError
      ? err
      : new CustomError(
          "Erreur lors de l'envoi du mail de non éligibilité",
          500,
        );
  }
};
