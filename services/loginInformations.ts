import crypto from 'crypto';
import config from '../utils/config';

/**
 * @see https://www.ssi.gouv.fr/administration/precautions-elementaires/calculer-la-force-dun-mot-de-passe/
 */
function generateToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

function generateLoginUrl(): string {
  return `${config.hostnameWithProtocol}/psychologue/login`;
}

export default {
  generateLoginUrl,
  generateToken,
};
