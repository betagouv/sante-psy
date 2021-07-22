import demarchesSimplifiees from '../jobs/demarchesSimplifiees';

const importLatestData = {
  cronTime: '*/5 * * * *', // every 5 minutes
  onTick: demarchesSimplifiees.importLatestDataFromDSToPG,
  start: true,
  timeZone: 'Europe/Paris',
  isActive: config.featureImportData,
  name: 'Import latest data from DS API to PG',
};

const importAllData = {
  cronTime: '0 */3 * * *', // every 3 hours
  onTick: demarchesSimplifiees.importEveryDataFromDSToPG,
  start: true,
  runOnInit: true,
  timeZone: 'Europe/Paris',
  isActive: config.featureImportData,
  name: 'Import ALL data from DS API to PG',
};

const checkDuplicateEmailOnAcceptedDossiers = {
  cronTime: '0 9 * * 1-5', // every weekday at 9am
  onTick: demarchesSimplifiees.checkForMultipleAcceptedDossiers,
  start: true,
  timeZone: 'Europe/Paris',
  isActive: config.featureImportData,
  name: 'checkForMultipleAcceptedDossiers',
};

export default [importLatestData, importAllData, checkDuplicateEmailOnAcceptedDossiers];
