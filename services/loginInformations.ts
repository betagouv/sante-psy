import crypto from 'crypto';
import config from '../utils/config';

/**
 * @see https://www.ssi.gouv.fr/administration/precautions-elementaires/calculer-la-force-dun-mot-de-passe/
 */
function generateToken(size = 64): string {
  return crypto.randomBytes(size).toString('hex');
}

function generateLoginUrl(): string {
  return `${config.hostnameWithProtocol}/login`;
}

function generateStudentSignInStepTwoUrl(): string {
  return `${config.hostnameWithProtocol}/inscription`;
}

export default {
  generateLoginUrl,
  generateStudentSignInStepTwoUrl,
  generateToken,
};
