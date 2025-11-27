import crypto from 'crypto';
import config from '../utils/config';

/**
 * @see https://www.ssi.gouv.fr/administration/precautions-elementaires/calculer-la-force-dun-mot-de-passe/
 */
function generateToken(size = 64): string {
  return crypto.randomBytes(size).toString('hex');
}

function generatePsyLoginUrl(): string {
  return `${config.hostnameWithProtocol}/login`;
}

function generateStudentSignInStepTwoUrl(): string {
  return `${config.hostnameWithProtocol}/inscription`;
}

function generateStudentLoginUrl(): string {
  return `${config.hostnameWithProtocol}/student/login`;
}

export default {
  generatePsyLoginUrl,
  generateStudentSignInStepTwoUrl,
  generateStudentLoginUrl,
  generateToken,
};
