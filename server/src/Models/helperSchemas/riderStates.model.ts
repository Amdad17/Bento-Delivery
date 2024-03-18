import { Schema } from 'mongoose';

import { IRiderStates } from '../../interfaces/IRider';
import { CustomerSchema } from '../customer/customer.model';

import { RestaurantShortInfoSchema } from './RestaurantShortInfoSchema.model';

export const RiderStates: Schema<IRiderStates> = new Schema(
  {
    state0: {
      completed: {
        type: Boolean,
        default: true,
      },
    },
    state1: {
      completed: {
        type: Boolean,
        default: false,
      },
      restaurant1: {
        type: RestaurantShortInfoSchema,
        default: null,
      },
    },
    state2: {
      completed: {
        type: Boolean,
        default: false,
      },
      restaurant2: {
        type: RestaurantShortInfoSchema,
        default: null,
      },
    },
    state3: {
      completed: {
        type: Boolean,
        default: false,
      },
      customer1: {
        type: CustomerSchema,
        default: null,
      },
    },
    state4: {
      completed: {
        type: Boolean,
        default: false,
      },
      customer2: {
        type: CustomerSchema,
        default: null,
      },
    },
  },
  { _id: false },
);
