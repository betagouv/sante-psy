import { NextFunction, Request, Response } from 'express';
import config from '../utils/config';
import cookie from '../utils/cookie';

const refreshToken = (req: Request, res: Response, next: NextFunction): void => {
  if (req.auth) {
    const now = (new Date()).getTime() / 1000;
    if (req.auth.exp - now > Number(config.refreshDurationHours) * 3600) {
      const userId = req.auth.userId || req.auth.psychologist;
      if (userId) {
        cookie.createAndSetJwtCookie(res, userId, req.auth.xsrfToken, req.auth.role);
      }
    }
  }

  next();
};

export default refreshToken;
