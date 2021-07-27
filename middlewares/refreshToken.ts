import { NextFunction, Request, Response } from 'express';
import config from '../utils/config';
import cookie from '../utils/cookie';

const refreshToken = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user) {
    const now = (new Date()).getTime() / 1000;
    if (req.user.exp - now > Number(config.refreshDurationHours) * 3600) {
      cookie.createAndSetJwtCookie(res, req.user.psychologist, req.user.xsrfToken);
    }
  }

  next();
};

export default refreshToken;
