import express from 'express';

import patientsController from '../controllers/patientsController';

const router = express.Router();

router.get('/', patientsController.getAll);
router.post('/',
  patientsController.createValidators,
  patientsController.create);
router.get('/:patientId',
  patientsController.getOneValidators, patientsController.getOne);
router.put('/:patientId',
  patientsController.updateValidators,
  patientsController.update);
router.delete('/:patientId',
  patientsController.deleteValidators,
  patientsController.delete);

export default router;
