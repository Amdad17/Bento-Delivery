import express from 'express';

import { bagCapacityCheckerController } from '../Controllers/bagChecker.controller';

const router = express.Router();

router.post('/', bagCapacityCheckerController);

export default router;
