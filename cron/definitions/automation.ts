import demarchesSimplifiees from '../jobs/demarchesSimplifiees';

const verifyPsychologists = {
  cronTime: '0 10 * * 1-5', // every weekday at 10am
  onTick: demarchesSimplifiees.autoVerifyPsychologists,
  start: true,
  timeZone: 'Europe/Paris',
  isActive: config.featureAutoVerify,
  name: 'Auto verify psychologist in DS',
};

const acceptPsychologists = {
  cronTime: '0 12 * * 3', // Every wednesday at noon
  onTick: demarchesSimplifiees.autoAcceptPsychologists,
  start: true,
  timeZone: 'Europe/Paris',
  isActive: config.featureAutoAccept,
  name: 'Auto accept psychologist from designated universities in DS',
};

export default [verifyPsychologists, acceptPsychologists];
