/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import db from '../db/db';
import { appointmentsTable, patientsTable, studentsTable } from '../db/tables';

type Candidate = {
  patient_firstNames: string;
  patient_lastName: string;
  student_firstNames: string;
  student_lastName: string;
  patientId: string;
  studentId: string;
  psyId: string;
};

// looking for patients which have a INE matching a student, with same first name and last name
const findCandidates = async (patientIds: string[]): Promise<Candidate[]> =>
  db(`${patientsTable} as p`)
    .leftJoin(`${studentsTable} as s`, 's.ine', 'p.INE')
    .select(
      'p.id as patientId',
      'p.firstNames as patient_firstNames',
      'p.lastName as patient_lastName',
      's.firstNames as student_firstNames',
      's.lastName as student_lastName',
      'p.psychologistId as psyId',
      's.id as studentId',
    )
    .whereIn('p.id', patientIds)
    .whereNull('p.student_id')
    .orderBy('p.createdAt', 'desc');

const workOnCandidate = async (candidate: Candidate): Promise<void> => {
  const otherPatientWithSameStudent = await db(patientsTable)
    .first()
    .where('student_id', candidate.studentId)
    .andWhere('psychologistId', candidate.psyId);

  if (!otherPatientWithSameStudent) {
    // we don't already have a patient with this student for this psy
    // we can just update this patient to be linked to the student
    console.log(
      `-- linking patient ${candidate.patientId} to student ${candidate.studentId}`,
    );
    await db('patients')
      .update({
        student_id: candidate.studentId,
        firstNames: null,
        lastName: null,
        INE: null,
        institutionName: null,
        doctorName: null,
        doctorAddress: null,
        hasPrescription: null,
        gender: null,
        email: null,
        updatedAt: new Date(),
        dateOfBirth: null,
      })
      .where('id', candidate.patientId)
      .andWhere('psychologistId', candidate.psyId);
  } else {
    console.log(
      `-- merging patient ${candidate.patientId} and ${otherPatientWithSameStudent.id}`,
    );
    // we already have a patient linked to the student
    // we need to put all appointments on the other patient and then delete the patient
    if (otherPatientWithSameStudent.deleted) {
      console.log('-- main patient is deleted do nothing');
      return;
    }
    const keepPatientId = otherPatientWithSameStudent.id;
    console.log('-- update appointments so that they point on keep patient');
    const appointments = await db(appointmentsTable)
      .select('id')
      .whereIn('patientId', [keepPatientId, candidate.patientId])
      .update({
        patientId: keepPatientId,
      });
    console.log(`-- updated ${appointments} appointments`);
    await db(patientsTable).whereIn('id', [candidate.patientId]).delete();
  }
};

const linkPatientsToStudents = async (patientIds: string[]): Promise<void> => {
  const candidates = await findCandidates(patientIds);
  console.log(candidates.length);

  for (const candidate of candidates) {
    await workOnCandidate(candidate);
  }
};

const patientIds = [];

linkPatientsToStudents(patientIds).catch((err) => {
  console.error('Fatal error while linking patients to students:', err);
  process.exit(1);
});
