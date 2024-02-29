import mongoose from 'mongoose';

export interface IRiderDailyRecords {
  _id?: string;
  riderId: string | mongoose.Types.ObjectId;
  averageOrdersOfToday: number;
  totalOrdersOfToday: number;
}
