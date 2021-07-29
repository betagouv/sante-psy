import { Request } from 'express';
import { validationResult } from 'express-validator';
import CustomError from './CustomError';

const checkErrors = (req: Request): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const allErrors = errors.array().map((error) => {
      console.debug('checkErrors form', error.msg);
      return error.msg;
    });

    throw new CustomError(allErrors.join(), 400);
  }
};

// Does not work for "oneOf" matchers
const hasErrorsForField = (req: Request, fieldName: string): boolean => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return false;
  }
  const hasErrorForField = errors.array().some((errorObj) => {
    if (errorObj.param === fieldName) {
      return true;
    }
    return false;
  });
  return hasErrorForField;
};

export default {
  checkErrors,
  hasErrorsForField,
};
