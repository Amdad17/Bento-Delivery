import { Schema } from 'mongoose';
// import { IRider } from '../../Interfaces/IRider';

import { ILongLat } from '../../interfaces/ILongLat';

export const LongLatSchema = new Schema<ILongLat>(
  {
    longitude: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);
