import students from '../db/students';
import { sendMail2, sendMail3, sendMail4 } from '../services/studentMails';

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
    const results = await students.getAllCreatedBetween(from, to);

    await Promise.all(results.map((student) => sendMail2(student)));
    console.log(`${results.length} mails sent`);
    return true;
  } catch (err) {
    console.error('ERROR: Could not send students mail J+3.', err);
    return false;
  }
};

const sendStudentsMailJ10 = async (): Promise<boolean> => {
  try {
    const { from, to } = getDates(10);
    const results = await students.getAllCreatedBetween(from, to);

    await Promise.all(results.map((student) => sendMail3(student)));
    console.log(`${results.length} mails sent`);
    return true;
  } catch (err) {
    console.error('ERROR: Could not send students mail J+10.', err);
    return false;
  }
};

const sendStudentsMailJ30 = async (): Promise<boolean> => {
  try {
    const { from, to } = getDates(30);
    const results = await students.getAllCreatedBetween(from, to);

    await Promise.all(results.map((student) => sendMail4(student)));
    console.log(`${results.length} mails sent`);
    return true;
  } catch (err) {
    console.error('ERROR: Could not send students mail J+30.', err);
    return false;
  }
};

export default { sendStudentsMailJ3, sendStudentsMailJ10, sendStudentsMailJ30 };
