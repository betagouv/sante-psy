import { Request, Response, NextFunction } from 'express';

export default (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => (req: Request, res: Response, next: NextFunction): void => {
  fn(req, res, next).catch(next);
};
