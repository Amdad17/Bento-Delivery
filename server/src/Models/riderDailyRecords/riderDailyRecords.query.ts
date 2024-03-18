import { IRiderDailyRecords } from '../../interfaces/IRiderDailyRecords';
import { getAverageNumberOfOrdersOnCurrentDay } from '../order/order.query';

import { RiderDailyRecords } from './riderDailyRecords.model';

export const getAllRidersDailyRecords = async () => {
  try {
    return await RiderDailyRecords.find();
  } catch (error) {
    console.error('Error getting all riders daily records', error);
  }
};

export const getRiderDailyRecordsByRiderId = async (riderId: string) => {
  try {
    return await RiderDailyRecords.findOne({ riderId });
  } catch (error) {
    throw new Error('Error getting rider daily records by rider id');
  }
};

export const updateRiderDailyRecords = async (riderDailyRecords: IRiderDailyRecords) => {
  try {
    const rider = await getRiderDailyRecordsByRiderId(riderDailyRecords.riderId.toString());
    if (rider) {
      return await RiderDailyRecords.findByIdAndUpdate(rider._id, riderDailyRecords, { new: true });
    } else {
      console.error('Rider not found');
    }
  } catch (error) {
    console.error('Error updating rider daily records', error);
  }
};

export const createRiderDailyRecords = async (riderDailyRecords: IRiderDailyRecords) => {
  try {
    return await RiderDailyRecords.create(riderDailyRecords);
  } catch (error) {
    console.error('Error creating rider daily records', error);
  }
};

export const deleteRiderDailyRecords = async (riderId: string) => {
  try {
    return await RiderDailyRecords.findOneAndDelete({ riderId });
  } catch (error) {
    console.error('Error deleting rider daily records', error);
  }
};

export const resetAllRidersDailyRecords = async () => {
  try {
    const riderRecords = await getAllRidersDailyRecords();
    if (!riderRecords) {
      return { message: 'No riders daily records found' };
    }
    for (let i = 0; i < riderRecords.length; i++) {
      console.log(i);
      const riderRecord = riderRecords[i];
      console.log(riderRecord);
      try {
        const averageOrdersOfToday = await getAverageNumberOfOrdersOnCurrentDay(
          String(riderRecord.riderId),
        );
        if (!averageOrdersOfToday) {
          continue;
        }
        try {
          await updateRiderDailyRecords({
            riderId: riderRecord.riderId,
            averageOrdersOfToday,
            totalOrdersOfToday: 0,
          });
        } catch (error) {
          console.log(error);
          continue;
        }
      } catch (error) {
        console.log(error);
        continue;
      }
    }
    return { message: 'All riders daily records reset' };
  } catch (error) {
    console.error('Error resetting all riders daily records', error);
  }
};
