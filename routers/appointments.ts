import express from 'express';

import appointmentsController from '@controllers/appointmentsController';

const router = express.Router();

router.get('/', appointmentsController.getAppointments);
router.post('/',
  appointmentsController.createNewAppointmentValidators,
  appointmentsController.createNewAppointment);
router.delete('/:appointmentId',
  appointmentsController.deleteAppointmentValidators,
  appointmentsController.deleteAppointment);

export default router;
