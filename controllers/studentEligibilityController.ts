import { Request, Response } from 'express';
import validation from '../utils/validation';
import db from '../db/db';
import { appointmentsTable, patientsTable, studentsTable } from '../db/tables';
import { getEndUnivYearStr, getStartUnivYearStr } from '../utils/univYears';

export const checkStudentEligibility = async (
  req: Request,
  res: Response,
): Promise<void> => {
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

  // is student eligible ?
  const isEligible = true;

  const startDate = getStartUnivYearStr(univYear);
  const endDate = getEndUnivYearStr(univYear);
  console.log('startDate', startDate, 'endDate', endDate);

  // has student had an appointment with psy during the univ year ?
  const appointmentsThisYear = await db(appointmentsTable)
    .where('patientId', patient.id)
    .andWhereBetween('appointmentDate', [startDate, endDate])
    .andWhere('deleted', false)
    .select();
  console.log('appointmentsThisYear', appointmentsThisYear);
  const hadAnAppointmentThisYear = appointmentsThisYear.length > 0;

  res.status(200).json({ isEligible, hadAnAppointmentThisYear });
};
