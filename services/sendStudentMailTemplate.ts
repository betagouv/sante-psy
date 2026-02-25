import ejs from 'ejs';
import logs from '../utils/logs';
import sendEmail from '../utils/email';
import config from '../utils/config';
import CustomError from '../utils/CustomError';

const sendStudentMailTemplate = async (
  email: string,
  loginUrl: string,
  token: string,
  template: string,
  title: string,
): Promise<void> => {
  try {
    const html = await ejs.renderFile(`./views/emails/${template}.ejs`, {
      loginUrlWithToken: `${loginUrl}/${encodeURIComponent(token)}`,
    });
    await sendEmail(email, `${config.appName} - ${title}`, html);
    console.log(`Login email sent for ${logs.hash(email)}`);
  } catch (err) {
    console.error(err);
    throw new CustomError('Erreur lors de l\'envoi de l\'email.', 500);
  }
};

export default sendStudentMailTemplate;
