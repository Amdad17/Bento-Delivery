import { Schema, model } from 'mongoose';

import { IOrder } from '../../interfaces/IOrder';
import { itemSchema } from '../helperSchemas/itemSchema.model';

export const OrderSchema = new Schema<IOrder>(
  {
    riderId: {
      type: Schema.Types.ObjectId,
      ref: 'Rider',
    },
    userId: {
      type: String,
      required: true,
    },
    restaurantId: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 5,
    },
    items: {
      type: [itemSchema],
    },
    orderTemperatureType: {
      type: String,
      enum: ['Hot', 'Cold'],
      required: true,
      default: 'Hot',
    },
    orderDeliveryTime: {
      minTime: {
        type: Date,
        required: true,
        default: Date.now,
      },
      maxTime: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
    subtotal: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

const Order = model<IOrder>('order', OrderSchema);

export default Order;
