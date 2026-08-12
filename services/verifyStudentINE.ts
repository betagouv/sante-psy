import verifyINE, { INEApiResult } from './inesApi';
import date from '../utils/date';
import config from '../utils/config';

// TODO rename this function and verifyINE because sound same and both use those arg
const verifyINEWithBirthDate = async (
  ine: string,
  rawDateOfBirth: string,
): Promise<INEApiResult> => {
  if (config.testEnvironment) {
    console.log('Call API INES skipped in test env');
    return {
      status: 'found',
    };
  }

  const dateOfBirth = date.parseForm(rawDateOfBirth);
  return verifyINE(ine, dateOfBirth);
};

export default verifyINEWithBirthDate;
