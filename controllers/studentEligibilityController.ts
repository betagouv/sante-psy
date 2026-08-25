import { Request, Response } from 'express';
import validation from '../utils/validation';
import db from '../db/db';
import { appointmentsTable, patientsTable, studentsTable } from '../db/tables';
import { getEndUnivYearStr, getStartUnivYearStr } from '../utils/univYears';
import s3Service from '../services/s3';
import { isStudentEligible } from '../db/studentEligibility';

export const checkStudentEligibility = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    validation.checkErrors(req);

    const { studentId, univYear } = req.params;
    const psychologistId = req.auth.userId || req.auth.psychologist;
    console.log('studentId', studentId);
    console.log('univYear', univYear);
    console.log('psychologistId', psychologistId);

    const student = await db(studentsTable).where('id', studentId).first();
    if (!student) {
      res.status(404).json({ message: "Cet étudiant n'existe pas" });
      return;
    }

    const patient = await db(patientsTable)
      .where('psychologistId', psychologistId)
      .andWhere('student_id', studentId)
      .andWhere('deleted', false)
      .first();
    if (!patient) {
      res.status(403).json({ message: 'Accès non autorisé' });
      return;
    }

    const isEligible = await isStudentEligible(student, univYear);

    const startDate = getStartUnivYearStr(univYear);
    const endDate = getEndUnivYearStr(univYear);

    const allAppointments = await db(appointmentsTable)
      .where('patientId', patient.id)
      .andWhere('deleted', false)
      .select();

    const appointmentsThisYear = allAppointments.filter(
      (a) => a.appointmentDate >= startDate && a.appointmentDate <= endDate,
    );

    const hadAnAppointmentWithPsy = allAppointments.length > 0;
    const hadAnAppointmentThisYear = appointmentsThisYear.length > 0;

    const shouldShowCertif = !hadAnAppointmentThisYear;

    res.status(200).json({
      isEligible,
      hadAnAppointmentWithPsy,
      hadAnAppointmentThisYear,
      shouldShowCertif,
    });
  } catch (err) {
    console.error('error: ', err);
    res.status(500).json({ message: 'Une erreur est survenue.' });
  }
};

export const seeStudentCertificate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  validation.checkErrors(req);

  const { studentId, univYear } = req.params;
  const psychologistId = req.auth.userId || req.auth.psychologist;

  if (!psychologistId) {
    res.status(401).json({ message: 'Non authentifié' });
    return;
  }

  const student = await db(studentsTable).where('id', studentId).first();
  if (!student) {
    res.status(404).json({ message: "Cet étudiant n'existe pas" });
    return;
  }

  const patient = await db(patientsTable)
    .where('psychologistId', psychologistId)
    .andWhere('student_id', studentId)
    .andWhere('deleted', false)
    .first();
  if (!patient) {
    res.status(403).json({ message: 'Accès non autorisé' });
    return;
  }

  try {
    const result = await s3Service.getCertificateStream(studentId, univYear);
    if (!result) {
      res.status(404).json({ message: 'Certificat non trouvé' });
      return;
    }

    res.setHeader('Content-Type', result.contentType || 'application/pdf');
    if (result.contentLength) {
      res.setHeader('Content-Length', result.contentLength.toString());
    }
    res.setHeader('Content-Disposition', 'inline; filename="certificate.pdf"');

    result.stream.pipe(res);
    result.stream.on('error', (err) => {
      console.error('[S3] stream error while sending certificate', err);
      if (!res.headersSent) res.status(500).end();
    });
  } catch (err) {
    console.error('error: ', err);
    res.status(500).json({ message: 'Une erreur est survenue.' });
  }
};
