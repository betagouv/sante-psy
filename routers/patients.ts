import express from 'express';

import patientsController from '@controllers/patientsController';

const router = express.Router();

router.get('/', patientsController.getPatients);
router.post('/',
  patientsController.createNewPatientValidators,
  patientsController.createNewPatient);
router.get('/:patientId',
  patientsController.getPatientValidators, patientsController.getPatient);
router.put('/:patientId',
  patientsController.editPatientValidators,
  patientsController.editPatient);
router.delete('/:patientId',
  patientsController.deletePatientValidators,
  patientsController.deletePatient);

export default router;
