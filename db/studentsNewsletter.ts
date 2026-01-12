import { studentsNewsletterTable } from './tables';
import db from './db';
import date from '../utils/date';
import { StudentNewsletter } from '../types/StudentNewsletter';

const insert = async (email: string, source: string): Promise<void> => {
  try {
    await db(studentsNewsletterTable)
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
): Promise<StudentNewsletter[]> => {
  try {
    return db
      .from(studentsNewsletterTable)
      .whereNotNull('email')
      .whereBetween('createdAt', [from, to]);
  } catch (err) {
    console.error('Erreur lors de la récuperation des étudiants', err);
    throw new Error('Erreur lors de la récuperation des étudiants');
  }
};

const getAllWithoutDoctorAppointment = async (): Promise<StudentNewsletter[]> => {
  try {
    return db
      .from(studentsNewsletterTable)
      .whereNotNull('email')
      .where('letter', false);
  } catch (err) {
    console.error('Erreur lors de la récuperation des étudiants', err);
    throw new Error('Erreur lors de la récuperation des étudiants');
  }
};

const updateById = async (
  id: string,
  student: Partial<StudentNewsletter>,
): Promise<void> => {
  try {
    return db(studentsNewsletterTable)
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
