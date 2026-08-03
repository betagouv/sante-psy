import express from 'express';
import patientsController from '../controllers/patientsController';
import access from '../utils/access';

const router = express.Router();

router.use(access.requirePsyRole);

router.get('/', patientsController.getAll);
router.post(
  '/',
  patientsController.createValidators,
  patientsController.create,
);
router.get(
  '/:patientId',
  patientsController.getOneValidators,
  patientsController.getOne,
);
router.delete(
  '/:patientId',
  patientsController.deleteValidators,
  patientsController.delete,
);

export default router;
