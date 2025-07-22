import express from 'express';
import multer from 'multer';
import patientsController from '../controllers/patientsController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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
router.put(
  '/:patientId',
  patientsController.updateValidators,
  patientsController.update,
);
router.delete(
  '/:patientId',
  patientsController.deleteValidators,
  patientsController.delete,
);

router.post(
  '/send-certificate',
  upload.single('file'),
  patientsController.sendCertificate,
);

export default router;
