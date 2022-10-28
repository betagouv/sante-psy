import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from 'express-jwt';
import config from '../utils/config';
import CustomError from '../utils/CustomError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorManager = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  if (error instanceof CustomError) {
    console.debug(error.message);
    res.status(error.statusCode).json({
      message: error.message,
    });
  } else if (error instanceof UnauthorizedError) {
    res.status(401).json({ message: error.message });
  } else {
    console.error(error);
    res.status(500).json({
      message: config.activateDebug ? error.message : 'Something went wrong, please try again',
    });
  }
};

export default errorManager;
