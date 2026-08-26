import { Request, Response } from 'express';
import asyncHelper from '../utils/async-helper';
import dbStudents from '../db/students';
import dbLoginToken from '../db/loginToken';
import CustomError from '../utils/CustomError';
import {
  signInValidator,
  emailValidator,
} from './validators/studentValidators';
import loginInformations from '../services/loginInformations';
import date from '../utils/date';
import db from '../db/db';
import ejs from 'ejs';
import { psychologistsTable, studentsTable } from '../db/tables';
import loginController from './loginController';
import sendSecondStepMail from '../services/sendSecondStepMail';
import validation from '../utils/validation';
import verifyINEWithBirthDate from '../services/verifyStudentINE';
import send from '../utils/email';
import signInAttempts from '../services/signInAttempts';
import config from '../utils/config';
import s3Service from '../services/s3';
import { sendWelcomeMail as emailWelcome } from '../services/email/sendWelcomeEmail';
import { sendNotEligibleEmail } from '../services/email/sendNotEligibleEmail';

type MulterRequest = Request & { file: Express.Multer.File };

const sendStudentSecondStepMail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;
    const existingPsy = await db(psychologistsTable).where({ email }).first();
    if (existingPsy) {
      res.json({
        message: 'Consulte ta boîte mail',
      });
      return;
    }
    const existingStudent = await db(studentsTable).where({ email }).first();
    if (existingStudent) {
      const token = await loginController.getOrCreateToken(email, 'student', 2);
      await loginController.sendStudentLoginEmail(
        email,
        loginInformations.generateLoginUrl(),
        token,
      );
    } else {
      await sendSecondStepMail.inviteNewStudentToCreateAccount(
        email,
        'studentSignInValidation',
        'Étape 2 de votre inscription',
      );
    }

    res.json({
      message: 'Consulte ta boîte mail',
    });
  } catch (err) {
    console.error(err);
    throw err instanceof CustomError
      ? err
      : new CustomError("Erreur lors de l'envoi du mail de connexion", 500);
  }
};

const sendWelcomeMail = async (email): Promise<void> => {
  emailWelcome(email);
};

const verifyStudentToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { token } = req.params;

  const tokenRow = await dbLoginToken.getByToken(token);

  if (!tokenRow) {
    throw new CustomError('Token invalide', 401);
  }

  if (new Date(tokenRow.expiresAt) < new Date()) {
    throw new CustomError('Token expiré', 401);
  }

  res.json({
    email: tokenRow.email,
    signInAttempts: tokenRow.signInAttempts,
  });
};

const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    validation.checkErrors(req);
    const {
      firstNames,
      lastName,
      dateOfBirth: rawDateOfBirth,
      ine,
      email,
      dryRun = false, // if true, student will not be created for now,
      acceptedCGUs,
      schoolType,
      schoolName,
      schoolPostcode,
      studyLevel,
      studyField,
      studyFieldOther,
      gender,
      livingPostcode,
      apiInesCheck,
    } = req.body;
    const tokenRow = await dbLoginToken.getByEmail(email);

    if (!tokenRow) {
      throw new CustomError('Token invalide', 401);
    }

    if (new Date(tokenRow.expiresAt) < new Date()) {
      throw new CustomError('Token expiré', 401);
    }

    if (dryRun) {
      const currentAttempts = tokenRow.signInAttempts;
      const duplicateCheck = await dbStudents.checkDuplicates(email, ine);

      if (duplicateCheck.status === 'alreadyRegistered') {
        const token = loginInformations.generateToken(32);
        const expiresAt = date.getDatePlusHours(2);

        await dbLoginToken.upsert(token, email, expiresAt, 'student');
        await loginController.sendStudentLoginEmail(
          email,
          loginInformations.generateLoginUrl(),
          token,
        );
        res.status(200).json({
          message: 'Un email vous a été envoyé.',
        });
        return;
      }

      if (duplicateCheck.status === 'conflict') {
        const { shouldSendCertificate } =
          await signInAttempts.checkAndIncrementAttempts(
            tokenRow.token,
            currentAttempts,
          );

        if (shouldSendCertificate) {
          await dbLoginToken.delete(tokenRow.token);
        }

        res.status(422).json({
          shouldContact: shouldSendCertificate,
        });
        return;
      }

      if (currentAttempts >= config.maxSignInAttempts) {
        res.status(422).json({
          shouldSendCertificate: true,
        });
        return;
      }

      const resCheckIne = await verifyINEWithBirthDate(ine, rawDateOfBirth);

      if (resCheckIne.status === 'technical_error') {
        console.warn('Erreur API INES', resCheckIne.error);
        res.status(502).json({
          message:
            'Le service de vérification INE est momentanément indisponible',
        });
        return;
      }

      if (resCheckIne.status === 'not_found') {
        const { shouldSendCertificate } =
          await signInAttempts.checkAndIncrementAttempts(
            tokenRow.token,
            currentAttempts,
          );

        res.status(422).json({ shouldSendCertificate });
        return;
      }

      res.status(200).json({
        message: "L'étudiant peut être créé sans erreur.",
      });
    } else {
      const student = await dbStudents.create({
        email,
        ine,
        firstNames,
        lastName,
        dateOfBirth: date.parseForm(rawDateOfBirth),
        acceptedCGUs,
        schoolType,
        schoolName,
        schoolPostcode,
        studyLevel,
        studyField,
        studyFieldOther,
        gender,
        livingPostcode,
        apiInesCheck,
      });
      s3Service
        .finalizePendingCertificate(tokenRow.token, student.id)
        .catch((err) => {
          console.error(
            `[finalizePendingCertificate] failed for student ${student.id}`,
            err,
          );
        });
      if (apiInesCheck) {
        sendWelcomeMail(email).catch((err) => {
          console.error(
            `[sendWelcomeMail] failed for student ${student.id}`,
            err,
          );
        });
      } else {
        sendNotEligibleEmail(email).catch((err) => {
          console.error(
            `[sendWelcomeMail] failed for student ${student.id}`,
            err,
          );
        });
      }

      res.status(200).json({
        message: 'Un email vous a été envoyé.',
      });
    }
  } catch (err) {
    console.error(err);

    res.status(403).json({
      message: 'Inscription non autorisée.',
    });
  }
};

const sendCertificate = async (
  req: MulterRequest,
  res: Response,
): Promise<void> => {
  const { email, ine } = req.body;

  // TODO gérer ça dans un validator
  if (!req.file || !email || !ine) {
    throw new CustomError('Certificat, email ou ine manquant.', 400);
  }

  const tokenRow = await dbLoginToken.getByEmail(email);

  if (!tokenRow) throw new CustomError('Token invalide', 401);
  if (new Date(tokenRow.expiresAt) < new Date()) {
    throw new CustomError('Token expiré', 401);
  }

  await s3Service.uploadPendingCertificate(tokenRow.token, req.file);

  const html = await ejs.renderFile(
    './views/emails/sendStudentCertificate.ejs',
    {
      email,
      ine,
    },
  );

  await send(
    // TODO : replace mail by env var
    'support-santepsyetudiant@beta.gouv.fr',
    'Nouveau certificat de scolarité reçu',
    html,
    [
      {
        filename: req.file.originalname,
        content: req.file.buffer,
      },
    ],
  );

  res.status(200).json({
    message: 'Certificat envoyé.',
  });
};

export default {
  sendStudentSecondStepMail: asyncHelper(sendStudentSecondStepMail),
  sendWelcomeMail: asyncHelper(sendWelcomeMail),
  verifyStudentToken: asyncHelper(verifyStudentToken),
  signIn: asyncHelper(signIn),
  emailValidator,
  studentSignInValidator: signInValidator,
  sendCertificate: asyncHelper(sendCertificate),
};
