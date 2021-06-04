import { Request, Response, NextFunction } from 'express';

const checkPsyParam = (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  if (req.params.psyId !== req.user.psychologist) {
    res.status(403).send();
    return;
  }
  next();
};

export default {
  checkPsyParam,
};
