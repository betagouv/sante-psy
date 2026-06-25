import dotenv from 'dotenv';
import { notifyStudentsAppointments } from '../cron_jobs/cronAppointmentsNotifications';

dotenv.config();

notifyStudentsAppointments();
