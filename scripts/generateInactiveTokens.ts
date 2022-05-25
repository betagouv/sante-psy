import db from '../db/db';
import loginInformations from '../services/loginInformations';

const generateInactiveTokens = async (): Promise<void> => {
  console.log('Generating inactive tokens for psychologists...');

  try {
    const psyWithoutInactiveToken = await db('psychologists').whereNotExists(function () {
      this.select('*').from('inactive_token').whereRaw('inactive_token.id = psychologists."dossierNumber"');
    });

    const nbPsyWithoutInactiveToken = psyWithoutInactiveToken.length;
    console.log('Generating', nbPsyWithoutInactiveToken, 'tokens');

    if (nbPsyWithoutInactiveToken > 0) {
      await db('inactive_token').insert(psyWithoutInactiveToken.map((psy) => ({
        id: psy.dossierNumber,
        token: loginInformations.generateToken(32),
      })));
    }

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

generateInactiveTokens();
