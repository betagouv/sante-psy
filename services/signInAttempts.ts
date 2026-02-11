import dbLoginToken from '../db/loginToken';

const MAX_SIGNIN_ATTEMPTS = parseInt(process.env.MAX_SIGNIN_ATTEMPTS || '3', 10);

const checkAndIncrementAttempts = async (
  token: string,
  currentAttempts: number,
): Promise<{ shouldSendCertificate: boolean }> => {
  await dbLoginToken.incrementAttempts(token);
  const newAttempts = currentAttempts + 1;
  return { shouldSendCertificate: newAttempts >= MAX_SIGNIN_ATTEMPTS };
};

export default {
  checkAndIncrementAttempts,
  MAX_SIGNIN_ATTEMPTS,
};
