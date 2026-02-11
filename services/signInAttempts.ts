import dbLoginToken from '../db/loginToken';
import config from '../utils/config';

const MAX_SIGNIN_ATTEMPTS = config.maxSignInAttempts;

const checkAndIncrementAttempts = async (
  token: string,
  currentAttempts: number,
): Promise<{ shouldSendCertificate: boolean }> => {
  // TODO: rendre cette méthode single responsability principle
  await dbLoginToken.incrementAttempts(token);
  const newAttempts = currentAttempts + 1;
  return { shouldSendCertificate: newAttempts >= MAX_SIGNIN_ATTEMPTS };
};

export default {
  checkAndIncrementAttempts,
  MAX_SIGNIN_ATTEMPTS,
};
