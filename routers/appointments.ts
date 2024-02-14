import express from 'express';

import appointmentsController from '../controllers/appointmentsController';

const router = express.Router();

router.get('/', appointmentsController.getAll);
router.get('/first', appointmentsController.getFirstAppointments);
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
