import express from 'express';

import testController from '@controllers/testController';

const router = express.Router();

router.get('/psychologist/:email', testController.getPsychologist);
router.post('/reset', testController.resetDB);
router.delete('/psychologist/:email/convention', testController.removeConvention);

export default router;
