import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from 'express-jwt';
import CustomError from '../utils/CustomError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorManager = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  if (error instanceof CustomError) {
    console.debug(error.message);
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  } else if (error instanceof UnauthorizedError) {
    res.status(401).json({ sucess: false, message: error.message });
  } else {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong, please ty again',
    });
  }
};

export default errorManager;
