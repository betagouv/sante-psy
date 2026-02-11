import dbLoginToken from '../db/loginToken';
import config from '../utils/config';

const checkAndIncrementAttempts = async (
  token: string,
  currentAttempts: number,
): Promise<{ shouldSendCertificate: boolean }> => {
  // TODO: rendre cette méthode single responsability principle
  await dbLoginToken.incrementAttempts(token);
  const newAttempts = currentAttempts + 1;
  return { shouldSendCertificate: newAttempts >= config.maxSignInAttempts };
};

export default {
  checkAndIncrementAttempts,
};
