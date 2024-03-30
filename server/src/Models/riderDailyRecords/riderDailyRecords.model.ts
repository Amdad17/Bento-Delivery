import mongoose from 'mongoose';

import { IRiderDailyRecords } from '../../interfaces/IRiderDailyRecords';

const { Schema } = mongoose;

const RiderDailyRecordsSchema = new Schema<IRiderDailyRecords>(
  {
    riderId: {
      type: Schema.Types.ObjectId,
      ref: 'Rider',
      required: true,
    },
    averageOrdersOfToday: {
      type: Number,
      required: true,
      default: 0,
    },
    totalOrdersOfToday: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { versionKey: false },
);

export const RiderDailyRecords = mongoose.model<IRiderDailyRecords>(
  'RiderDailyRecords',
  RiderDailyRecordsSchema,
);
