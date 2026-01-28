import { CookieOptions, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { psyJWT } from '../types/LoginToken';
import config from './config';
import CustomError from './CustomError';

const headers: CookieOptions = {
  secure: !config.useCors,
  httpOnly: true,
  sameSite: 'lax',
};

const getSessionDuration = (): string => `${config.sessionDurationHours} hours`;

const getJwtTokenForUser = (userId: string, xsrfToken: string, role?: 'psy' | 'student'): string => {
  const duration = getSessionDuration();

  interface JWTPayload {
    xsrfToken: string;
    role?: 'psy' | 'student';
    userId?: string;
    psychologist?: string;
  }

  const payload: JWTPayload = {
    xsrfToken,
    role,
  };

  if (role) {
    payload.userId = userId;
  } else {
    payload.psychologist = userId;
  }

  return jwt.sign(payload, config.secret, { expiresIn: duration });
};

const createAndSetJwtCookie = (
  res: Response,
  userId: string,
  xsrfToken: string,
  role?: 'psy' | 'student',
): void => {
  const jwtToken = getJwtTokenForUser(userId, xsrfToken, role);
  res.cookie('token', jwtToken, headers);
};

const clearJwtCookie = (res: Response): void => {
  res.clearCookie('token');
};

const verifyJwt = (req: Request, res: Response): psyJWT | undefined => {
  try {
    const verified = jwt.verify(req.cookies.token, config.secret);
    return verified as psyJWT;
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
