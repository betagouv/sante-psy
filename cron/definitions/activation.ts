import psychologists from '../jobs/psychologists';

const reactivatePsychologists = {
  cronTime: '0 6 * * *', // every day at 6AM
  onTick: psychologists.reactivatePsychologists,
  start: true,
  timeZone: 'Europe/Paris',
  isActive: true,
  name: 'Check active boolean on every Psychologist',
};

export default [reactivatePsychologists];
