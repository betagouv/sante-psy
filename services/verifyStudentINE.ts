import verifyINE from './inesApi';
import date from '../utils/date';
import config from '../utils/config';

const verifyINEWithBirthDate = async (
  ine: string,
  rawDateOfBirth: string,
): Promise<boolean> => {
  if (config.testEnvironment) {
    console.log('Call API INES skipped in test env');
    return true;
  }

  const dateOfBirth = date.parseForm(rawDateOfBirth);

  try {
    await verifyINE(ine, dateOfBirth);
    return true;
  } catch (err) {
    console.warn('Erreur API INES', err);
    return false;
  }
};

export default verifyINEWithBirthDate;
