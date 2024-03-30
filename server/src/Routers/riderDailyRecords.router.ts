import express from 'express';
// import { IRider } from '../../Interfaces/IRider';

import {
  findAllRidersDailyRecords,
  findRiderDailyRecordsByRiderId,
  updateRiderDailyRecordsController,
  createRiderDailyRecordsController,
} from '../controllers/riderDailyRecords.controller';
const router = express.Router();

router.get('/all', findAllRidersDailyRecords);
router.get('/:riderId', findRiderDailyRecordsByRiderId);
router.put('/', updateRiderDailyRecordsController);
router.post('/', createRiderDailyRecordsController);

export default router;
