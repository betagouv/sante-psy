import { NextFunction, Request, Response } from 'express';
import CustomError from '../utils/CustomError';

const xsrfProtection = (req: Request, res: Response, next: NextFunction): void => {
  if (req.headers && req.headers['xsrf-token']) {
    const cookieXsrfToken = req.user.xsrfToken;
    const xsrfToken = req.headers['xsrf-token'];
    if (xsrfToken === cookieXsrfToken) {
      return next();
    }
  }

  throw new CustomError('Bad XSRF token', 401);
};

export default xsrfProtection;
