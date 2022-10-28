import { NextFunction, Request, Response } from 'express';
import config from '../utils/config';
import cookie from '../utils/cookie';

const refreshToken = (req: Request, res: Response, next: NextFunction): void => {
  if (req.auth) {
    const now = (new Date()).getTime() / 1000;
    if (req.auth.exp - now > Number(config.refreshDurationHours) * 3600) {
      cookie.createAndSetJwtCookie(res, req.auth.psychologist, req.auth.xsrfToken);
    }
  }

  next();
};

export default refreshToken;
