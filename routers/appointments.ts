import express from 'express';

import appointmentsController from '../controllers/appointmentsController';
import access from '../utils/access';

const router = express.Router();

router.use(access.requirePsyRole);

router.get('/', appointmentsController.getAll);
router.get('/:patientId', appointmentsController.getByPatientId);
router.post(
  '/',
  appointmentsController.createValidators,
  appointmentsController.create,
);
router.delete(
  '/:appointmentId',
  appointmentsController.deleteValidators,
  appointmentsController.delete,
);

export default router;
