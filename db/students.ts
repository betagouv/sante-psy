import { studentsTable } from './tables';
import db from './db';
import date from '../utils/date';
import { Student } from '../types/Student';

const insert = async (email: string, source: string): Promise<void> => {
  try {
    await db(studentsTable)
      .insert({ email, source })
      .onConflict('email')
      .ignore();
  } catch (err) {
    console.error('Erreur de sauvegarde du mail', err);
    throw new Error('Erreur de sauvegarde du mail');
  }
};

const getAllCreatedBetweenWithEmail = async (
  from: Date,
  to: Date,
): Promise<Student[]> => {
  try {
    return db
      .from(studentsTable)
      .whereNotNull('email')
      .whereBetween('createdAt', [from, to]);
  } catch (err) {
    console.error('Erreur lors de la récuperation des étudiants', err);
    throw new Error('Erreur lors de la récuperation des étudiants');
  }
};

const getAllWithoutDoctorAppointment = async (): Promise<Student[]> => {
  try {
    return db
      .from(studentsTable)
      .whereNotNull('email')
      .where('letter', false);
  } catch (err) {
    console.error('Erreur lors de la récuperation des étudiants', err);
    throw new Error('Erreur lors de la récuperation des étudiants');
  }
};

const updateById = async (
  id: string,
  student: Partial<Student>,
): Promise<void> => {
  try {
    return db(studentsTable)
      .where('id', id)
      .update({
        ...student,
        updatedAt: date.now(),
      });
  } catch (err) {
    console.error("Erreur de modification de l'étudiant", err);
    throw new Error("Erreur de modification de l'étudiant");
  }
};

export default {
  insert,
  getAllCreatedBetweenWithEmail,
  getAllWithoutDoctorAppointment,
  updateById,
};
