import db from '../db/db';
import { appointmentsTable, patientsTable } from '../db/tables';
import { sendAppointmentsNotificationEmail } from '../services/email/studentAppointmentsNotification';
import { Appointment } from '../types/Appointment';
import dotenv from 'dotenv';
import getAppointmentsCount from '../services/getAppointmentsCount';
import { MAX_APPOINTMENT_NEW } from '../services/getBadges';

dotenv.config();

export const notifyStudentsAppointments = async (): Promise<boolean> => {
  try {
    // get appointments created between yesterday 6:00 and today 6:00
    const start = new Date();
    start.setDate(start.getDate() - 1);
    start.setHours(6, 0, 0, 0);

    const end = new Date();
    end.setHours(6, 0, 0, 0);

    const appointments = await db.raw(
      `
        SELECT 
            p."INE",
            LOWER(p.email) as email,
            json_agg(a.*) as appointments
        FROM ${appointmentsTable} a
        JOIN ${patientsTable} p ON a."patientId" = p.id
        WHERE a."createdAt" BETWEEN :start AND :end
        AND a.deleted = false
        GROUP BY p."INE", LOWER(p.email)
        `,
      { start, end },
    );

    console.log(
      `--#${appointments.rows.length} students will be notified they had appointments declared`,
    );

    await Promise.all(
      appointments.rows.map(async (row) => {
        const { email, appointments: studentAppointments } = row;
        studentAppointments.sort(
          (a, b) =>
            new Date(a.appointmentDate).getTime() -
            new Date(b.appointmentDate).getTime(),
        );
        const { patientId } = studentAppointments[0];
        const patientEntry = await db(patientsTable)
          .where('id', patientId)
          .first();
        const withAppointmentCount = await getAppointmentsCount([patientEntry]);
        await sendAppointmentsNotificationEmail(
          email,
          MAX_APPOINTMENT_NEW -
            parseInt(withAppointmentCount[0].countedAppointments, 10),
          studentAppointments.map((a: Appointment) => ({
            psyId: a.psychologistId,
            date: new Date(a.appointmentDate).toLocaleDateString('fr-FR'),
          })),
        );
      }),
    );
    console.log('-- job finished');
    return true;
  } catch (err) {
    console.error('ERROR: Appointments notifications job failed.', err);
    return false;
  }
};

notifyStudentsAppointments();
