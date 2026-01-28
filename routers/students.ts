import express from 'express';

import access from '../utils/access';

const router = express.Router();

router.use(access.requireStudentRole);

// Student routes will be added here as needed

export default router;
