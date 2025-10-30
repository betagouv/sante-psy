import { CookieOptions, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PsyJWT } from '../types/PsyLoginToken';
import config from './config';
import CustomError from './CustomError';

const headers: CookieOptions = {
  secure: !config.useCors,
  httpOnly: true,
  sameSite: 'lax',
};

const getSessionDuration = (): string => `${config.sessionDurationHours} hours`;

/**
 * get a json web token to store psychologist data
 * token = encodeBase64(header) + '.' + encodeBase64(payload) + '.' + encodeBase64(signature)
 * @param {*} id
 * @see https://www.ionos.fr/digitalguide/sites-internet/developpement-web/json-web-token-jwt/
 */
const getJwtTokenForUser = (psychologist: string, xsrfToken: string): string => {
  const duration = getSessionDuration();

  return jwt.sign(
    {
      psychologist,
      xsrfToken,
    },
    config.secret,
    { expiresIn: duration },
  );
};
const createAndSetJwtCookie = (res: Response, psychologistData: string, xsrfToken: string): void => {
  const jwtToken = getJwtTokenForUser(psychologistData, xsrfToken);
  res.cookie('token', jwtToken, headers);
};

const clearJwtCookie = (res: Response): void => {
  res.clearCookie('token');
};

const verifyJwt = (req: Request, res: Response): PsyJWT | undefined => {
  try {
    const verified = jwt.verify(req.cookies.token, config.secret);
    return verified as PsyJWT;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.clearCookie('token');
      throw new CustomError('Votre session a expiré, veuillez vous reconnecter.', 498);
    }
    console.debug('Invalid token: ', err);
    return undefined;
  }
};

export default {
  headers,
  getSessionDuration,
  getJwtTokenForUser,
  createAndSetJwtCookie,
  clearJwtCookie,
  verifyJwt,
};
