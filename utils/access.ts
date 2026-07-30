import { Request, Response, NextFunction } from 'express';
import dbStudents from '../db/students';

/**
 * Check that user is a psychologist and psyId param matches their ID
 */
const checkPsyParam = (req: Request, res: Response, next: NextFunction) : void => {
  const psychologistId = req.auth.userId || req.auth.psychologist;

  if (req.auth.role && req.auth.role !== 'psy') {
    console.warn('⚠️ Access denied - Wrong role for psychologist route:', {
      role: req.auth.role,
      expectedRole: 'psy',
      userId: psychologistId,
      psyIdParam: req.params.psyId,
      path: req.path,
      method: req.method,
    });
    res.status(403).send();
    return;
  }

  if (!req.auth || req.params.psyId !== psychologistId) {
    console.warn('⚠️ Access denied - psyId mismatch or no auth:', {
      hasAuth: !!req.auth,
      userId: psychologistId,
      psyIdParam: req.params.psyId,
      path: req.path,
      method: req.method,
    });
    res.status(403).send();
    return;
  }

  next();
};

/**
 * Check that user is a psychologist (no URL param validation)
 */
const requirePsyRole = (req: Request, res: Response, next: NextFunction) : void => {
  const psychologistId = req.auth.userId || req.auth.psychologist;

  if (req.auth.role && req.auth.role !== 'psy') {
    console.warn('⚠️ Access denied - Wrong role for psychologist-only route:', {
      role: req.auth.role,
      expectedRole: 'psy',
      userId: psychologistId,
      path: req.path,
      method: req.method,
    });
    res.status(403).send();
    return;
  }

  if (!req.auth || !psychologistId) {
    console.warn('⚠️ Access denied - No auth or psychologist ID:', {
      hasAuth: !!req.auth,
      userId: psychologistId,
      path: req.path,
      method: req.method,
    });
    res.status(403).send();
    return;
  }

  next();
};

/**
 * Check that user is a student and studentId param matches their ID
 */
const checkStudentParam = (req: Request, res: Response, next: NextFunction) : void => {
  const studentId = req.auth.userId || req.auth.psychologist;

  if (req.auth.role && req.auth.role !== 'student') {
    console.warn('⚠️ Access denied - Wrong role for student route:', {
      role: req.auth.role,
      expectedRole: 'student',
      userId: studentId,
      studentIdParam: req.params.studentId,
      path: req.path,
      method: req.method,
    });
    res.status(403).send();
    return;
  }

  if (!req.auth || req.params.studentId !== studentId) {
    console.warn('⚠️ Access denied - studentId mismatch or no auth:', {
      hasAuth: !!req.auth,
      userId: studentId,
      studentIdParam: req.params.studentId,
      path: req.path,
      method: req.method,
    });
    res.status(403).send();
    return;
  }

  next();
};

/**
 * Check that user is a student (no URL param validation)
 */
const requireStudentRole = (req: Request, res: Response, next: NextFunction) : void => {
  const studentId = req.auth.userId || req.auth.psychologist;

  if (req.auth.role && req.auth.role !== 'student') {
    console.warn('⚠️ Access denied - Wrong role for student-only route:', {
      role: req.auth.role,
      expectedRole: 'student',
      userId: studentId,
      path: req.path,
      method: req.method,
    });
    res.status(403).send();
    return;
  }

  if (!req.auth || !studentId) {
    console.warn('⚠️ Access denied - No auth or student ID:', {
      hasAuth: !!req.auth,
      userId: studentId,
      path: req.path,
      method: req.method,
    });
    res.status(403).send();
    return;
  }

  next();
};

const checkEmailChangeToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const studentId = req.auth.userId;
  const { token } = req.params;

  const student = await dbStudents.getByEmailChangeToken(token);

  if (!student) {
    console.warn('⚠️ Access denied - Invalid or expired email change token:', {
      studentId,
      path: req.path,
      method: req.method,
    });
    res.status(404).send();
    return;
  }

  if (student.id !== studentId) {
    console.warn('⚠️ Access denied - Email change token does not belong to student:', {
      tokenStudentId: student.id,
      requestStudentId: studentId,
      path: req.path,
      method: req.method,
    });
    res.status(403).send();
    return;
  }

  next();
};

export default {
  checkPsyParam,
  requirePsyRole,
  checkStudentParam,
  requireStudentRole,
  checkEmailChangeToken,
};
