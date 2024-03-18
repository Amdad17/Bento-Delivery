import { Request, Response } from 'express';

import { IRiderDailyRecords } from '../interfaces/IRiderDailyRecords';
import {
  getAllRidersDailyRecords,
  getRiderDailyRecordsByRiderId,
  updateRiderDailyRecords,
  createRiderDailyRecords,
} from '../models/riderDailyRecords/riderDailyRecords.query';

export async function findAllRidersDailyRecords(req: Request, res: Response) {
  try {
    const ridersDailyRecords = await getAllRidersDailyRecords();
    res.status(200).json(ridersDailyRecords);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

export async function findRiderDailyRecordsByRiderId(req: Request, res: Response) {
  try {
    const { riderId } = req.params;
    const riderDailyRecords = await getRiderDailyRecordsByRiderId(riderId);
    res.status(200).json(riderDailyRecords);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

export async function updateRiderDailyRecordsController(req: Request, res: Response) {
  try {
    const updatedRiderDailyRecords = await updateRiderDailyRecords(req.body as IRiderDailyRecords);
    res.status(200).json(updatedRiderDailyRecords);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

export async function createRiderDailyRecordsController(req: Request, res: Response) {
  try {
    const newRiderDailyRecords = await createRiderDailyRecords(req.body as IRiderDailyRecords);
    res.status(201).json(newRiderDailyRecords);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}
