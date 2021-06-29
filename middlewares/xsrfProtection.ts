import { NextFunction, Request, Response } from 'express';
import CustomError from '../utils/CustomError';

export const checkXsrf = (req: Request, cookieXsrfToken: string): boolean => {
  if (req.headers && req.headers['xsrf-token']) {
    const xsrfToken = req.headers['xsrf-token'];

    if (xsrfToken === cookieXsrfToken) {
      return true;
    }
  }
  return false;
};

const xsrfProtection = (req: Request, res: Response, next: NextFunction): void => {
  const cookieXsrfToken = req.user.xsrfToken;
  if (checkXsrf(req, cookieXsrfToken)) {
    return next();
  }

  throw new CustomError('Bad XSRF token', 401);
};

export default xsrfProtection;
