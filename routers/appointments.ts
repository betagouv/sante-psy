import express from 'express';

import appointmentsController from '../controllers/appointmentsController';

const router = express.Router();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
