import express from 'express';

import universitiesController from '../controllers/universitiesController';

const router = express.Router();

router.get('/:universityId', universitiesController.getOneValidators, universitiesController.getOne);

export default router;
