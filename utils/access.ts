import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user: {
    psychologist: string
  }
}

const checkPsyParam = (req: CustomRequest, res: Response, next: NextFunction) : Promise<void> => {
  if (req.params.psyId !== req.user.psychologist) {
    res.status(403).send();
    return;
  }
  next();
};

export default {
  checkPsyParam,
};
