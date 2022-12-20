import students from '../db/students';
import {
  sendMail2,
  sendMail3,
  sendMail4,
  sendMailDoctorAppointment,
  sendMailDoctorAppointment2,
} from '../services/studentMails';

const getDates = (days: number): { from: Date, to: Date } => {
  const now = new Date();
  const from = new Date();
  const to = new Date();
  from.setDate(now.getDate() - days);
  to.setDate(now.getDate() - days);
  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);
  return { from, to };
};

const sendStudentsMailJ3 = async (): Promise<boolean> => {
  try {
    const { from, to } = getDates(3);
    const results = await students.getAllCreatedBetweenWithEmail(from, to);
    const n = results.length;
    console.log(`Students J+3: sending ${n} mails...`);

    for (let i = 0; i < n; i++) {
      const student = results[i];
      // eslint-disable-next-line no-await-in-loop
      await sendMail2(student).catch((err) => console.error('Students J+3: error sending mail to', student.id, err));
    }

    console.log('Students J+3: done');
    return true;
  } catch (err) {
    console.error('ERROR: Could not send students mail J+3.', err);
    return false;
  }
};

const sendStudentsMailJ10 = async (): Promise<boolean> => {
  try {
    const { from, to } = getDates(10);
    const results = await students.getAllCreatedBetweenWithEmail(from, to);
    const n = results.length;
    console.log(`Students J+10: sending ${n} mails...`);

    for (let i = 0; i < n; i++) {
      const student = results[i];
      // eslint-disable-next-line no-await-in-loop
      await sendMail3(student).catch((err) => console.error('Students J+10: error sending mail to', student.id, err));
    }

    console.log('Students J+10: done');
    return true;
  } catch (err) {
    console.error('ERROR: Could not send students mail J+10.', err);
    return false;
  }
};

const sendStudentsMailJ30 = async (): Promise<boolean> => {
  try {
    const { from, to } = getDates(30);
    const results = await students.getAllCreatedBetweenWithEmail(from, to);
    const n = results.length;
    console.log(`Students J+30: sending ${n} mails...`);

    for (let i = 0; i < n; i++) {
      const student = results[i];
      // eslint-disable-next-line no-await-in-loop
      await sendMail4(student).catch((err) => console.error('Students J+30: error sending mail to', student.id, err));
    }

    console.log('Students J+30: done');
    return true;
  } catch (err) {
    console.error('ERROR: Could not send students mail J+30.', err);
    return false;
  }
};

const sendStudentsMailDoctorAppointment = async (): Promise<boolean> => {
  try {
    const results = await students.getAllWithoutDoctorAppointment();
    const n = results.length;
    console.log(`Students DoctorAppointment: sending ${n} mails...`);

    for (let i = 0; i < n; i++) {
      const student = results[i];
      // eslint-disable-next-line no-await-in-loop
      await sendMailDoctorAppointment(student).catch((err) => console.error(
        'Students DoctorAppointment: error sending mail to',
        student.id,
        err,
      ));
    }

    console.log('Students DoctorAppointment: done');
    return true;
  } catch (err) {
    console.error(
      'ERROR: Could not send students mail DoctorAppointment.',
      err,
    );
    return false;
  }
};

const sendStudentsMailDoctorAppointment2 = async (): Promise<boolean> => {
  try {
    const results = await students.getAllWithoutDoctorAppointment();
    const n = results.length;
    console.log(`Students DoctorAppointment2: sending ${n} mails...`);

    for (let i = 0; i < n; i++) {
      const student = results[i];
      // eslint-disable-next-line no-await-in-loop
      await sendMailDoctorAppointment2(student).catch((err) => console.error(
        'Students DoctorAppointment2: error sending mail to',
        student.id,
        err,
      ));
    }

    console.log('Students DoctorAppointment2: done');
    return true;
  } catch (err) {
    console.error(
      'ERROR: Could not send students mail DoctorAppointment2.',
      err,
    );
    return false;
  }
};

export default {
  sendStudentsMailJ3,
  sendStudentsMailJ10,
  sendStudentsMailJ30,
  sendStudentsMailDoctorAppointment,
  sendStudentsMailDoctorAppointment2,
};
