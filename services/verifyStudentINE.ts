import verifyINE from './inesApi';
import date from '../utils/date';
import config from '../utils/config';

// TODO rename this function and verifyINE because sound same and both use those arg
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
    // TODO: catch needed or error handled in verifyINE ?
  } catch (err) {
    console.warn('Erreur API INES', err);
    return false;
  }
};

export default verifyINEWithBirthDate;
