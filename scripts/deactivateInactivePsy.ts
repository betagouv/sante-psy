import db from '../db/db';
import dbPsychologists from '../db/psychologists';

const deactivateInactivePsy = async (dryRun: boolean): Promise<void> => {
  console.log('Deactivating inactive psychologists...');
  if (dryRun) {
    console.log('WARNING: dry-run mode on! (no changes will be applied)');
  }

  try {
    const inactivePsyList = await db.select('psychologists.*')
      .from('psychologists')
      .joinRaw('inner join inactive_token '
        + 'on inactive_token."id" = psychologists."dossierNumber"')
      .joinRaw('left join last_connections '
        + 'on last_connections."psychologistId" = psychologists."dossierNumber"')
      .where('psychologists.archived', false)
      .andWhere('psychologists.state', 'accepte')
      .andWhere('psychologists.active', true)
      .andWhere('inactive_token.confirm', false)
      .andWhereRaw('(last_connections."at" IS NULL OR last_connections."at" < \'2021-08-07\')');

    console.log(`${inactivePsyList.length} inactive psychologists found`);

    if (!dryRun) {
      const promises = inactivePsyList.map((psy) => dbPsychologists.suspend(
        psy.dossierNumber,
        new Date('9999-12-31'),
        'Autre: désactivé par Santé Psy Étudiant pour inactivité',
      ));

      await Promise.all(promises);
    }

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv.length > 2 && process.argv[2] !== '--dry-run') {
  console.log("Invalid arg - did you mean '--dry-run'?");
  process.exit(1);
}

const dryRun = process.argv.length > 2 && process.argv[2] === '--dry-run';
deactivateInactivePsy(dryRun);
