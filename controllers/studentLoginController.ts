// TODO IN LOGIN TICKET

// import { Request, Response } from 'express';

// import { check } from 'express-validator';
// import ejs from 'ejs';
// import validation from '../utils/validation';
// import dbStudents from '../db/students';
// import dbLoginToken from '../db/studentLoginToken';
// import date from '../utils/date';
// import cookie from '../utils/cookie';
// import logs from '../utils/logs';
// import sendEmail from '../utils/email';
// import config from '../utils/config';
// import asyncHelper from '../utils/async-helper';
// import CustomError from '../utils/CustomError';
// import { checkXsrf } from '../middlewares/xsrfProtection';
// import loginInformations from '../services/loginInformations';
// import DOMPurify from '../services/sanitizer';

// todo import validator from le fichier de validator
// const emailValidators = [
//   check('email')
//     .isEmail()
//     .withMessage('Vous devez spécifier un email valide.'),
// ];

// async function sendStudentLoginEmail(email: string, loginUrl: string, token: string): Promise<void> {
//   try {
//     const html = await ejs.renderFile('./views/emails/studentLogin.ejs', {
//       loginUrlWithToken: `${loginUrl}/${encodeURIComponent(token)}`,
//       appName: config.appName,
//       loginUrl,
//     });
//     await sendEmail(email, `Connexion à ${config.appName}`, html);
//     console.log(`Login email sent for ${logs.hash(email)}`);
//   } catch (err) {
//     console.error(err);
//     throw new Error("Erreur d'envoi de mail - sendStudentLoginEmail");
//   }
// }

// // créer l'équivalent pour les students qui n'ont pas rempli la deuxième étape ?
// // async function sendNotYetAcceptedEmail(email: string): Promise<void> {
// //   try {
// //     const html = await ejs.renderFile('./views/emails/loginNotAcceptedYet.ejs', {
// //       appName: config.appName,
// //     });
// //     await sendEmail(email, `C'est trop tôt pour vous connecter à ${config.appName}`, html);
// //     console.log(`Not yet accepted email sent for ${logs.hash(email)}`);
// //   } catch (err) {
// //     console.error(err);
// //     throw new Error("Erreur d'envoi de mail - sendNotYetAcceptedEmail");
// //   }
// // }

// async function saveStudentToken(email: string, token: string): Promise<void> {
//   try {
//     const expiresAt = date.getDatePlusTwoHours();
//     await dbLoginToken.insert(token, email, expiresAt);

//     console.log(`Login token created for ${logs.hash(email)}`);
//   } catch (err) {
//     console.error(`Erreur de sauvegarde du token : ${err}`);
//     throw new Error('Erreur de sauvegarde du token');
//   }
// }

// const deleteStudentToken = (req: Request, res: Response): void => {
//   cookie.clearJwtCookie(res);
//   res.json({ });
// };

// const connectedStudent = async (req: Request, res: Response): Promise<void> => {
//   const tokenData = cookie.verifyJwt(req, res);
//   if (tokenData && checkXsrf(req, tokenData.xsrfToken)) {
//     const student = await dbStudents.getStudentById(tokenData.user);

//     if (student) {
//       const {
//         id,
//         firstNames,
//         ine,
//         email,
//         createdAt,
//       } = student;
//       res.json({
//         id,
//         firstNames,
//         ine,
//         email,
//         createdAt,
//       });

//       return;
//     }
//   }

//   res.json();
// };

// const studentLogin = async (req: Request, res: Response): Promise<void> => {
//   if (req.body.token) {
//     const token = DOMPurify.sanitize(req.body.token);
//     const dbToken = await dbLoginToken.getStudentByToken(token);

//     if (dbToken) {
//       const studentData = await dbStudents.getStudentByEmail(dbToken.email);
//       const xsrfToken = loginInformations.generateToken();
//       cookie.createAndSetJwtCookie(res, studentData.id, xsrfToken);
//       console.log(`Successful authentication for ${logs.hash(dbToken.email)}`);

//       dbLoginToken.delete(token);
//       // do i need last connection ?
//       // dbLastConnection.upsert(studentData.id);

//       res.json(xsrfToken);
//       return;
//     }

//     console.log(`Invalid or expired token received : ${token.substring(0, 5)}...`);
//   }

//   throw new CustomError(
//     'Ce lien est invalide ou expiré. Indiquez votre email ci-dessous pour en avoir un nouveau.',
//     401,
//   );
// };

// const sendStudentMail = async (req: Request, res: Response): Promise<void> => {
//   validation.checkErrors(req);
//   const { email } = req.body;

//   console.log(`User with ${logs.hash(email)} asked for a login link`);
//   const studentIsRegistered = await dbStudents.getStudentByEmail(email);

//   if (!studentIsRegistered) {
//     console.warn(`Email inconnu qui essaye d'accéder au service : ${
//       logs.hash(email)}
//     `);
//     // il faut return 201 et mettre un message qui dit "si vous etes bien inscrit, vous allez recevoir un mail"
//     // throw new CustomError(
//     //   `L'email ${email} est inconnu.`,
//     //   401,
//     // );
//   }

//   const token = loginInformations.generateToken(32);
//   const loginUrl = loginInformations.generateStudentLoginUrl();
//   await sendStudentLoginEmail(email, loginUrl, token);
//   await saveStudentToken(email, token);
//   res.json({
//     message: `Un lien de connexion a été envoyé à l'adresse ${email
//     }. Le lien est valable ${config.sessionDurationHours} heures.`,
//   });
// };

// export default {
//   emailValidators,
//   connectedPsy: asyncHelper(connectedStudent),
//   psyLogin: asyncHelper(studentLogin),
//   sendPsyMail: asyncHelper(sendStudentMail),
//   deletePsyToken: deleteStudentToken,
// };
