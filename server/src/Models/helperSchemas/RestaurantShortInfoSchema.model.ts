import { Schema, model } from 'mongoose';

export const RestaurantShortInfoSchema = new Schema(
  {
    restaurantId: {
      type: Number,
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
    },
    restaurantLongitude: {
      type: Number,
      required: true,
    },
    restaurantLatitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

const RestaurantShortInfo = model('RestaurantShortInfo', RestaurantShortInfoSchema);

export default RestaurantShortInfo;
