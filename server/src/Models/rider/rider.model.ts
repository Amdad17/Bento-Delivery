import { Schema, model } from 'mongoose';

import { IRider } from '../../interfaces/IRider';
import { CustomerSchema } from '../customer/customer.model';
import { RestaurantShortInfoSchema } from '../helperSchemas/RestaurantShortInfoSchema.model';
import { LongLatSchema } from '../longLat/longLat.model';
import { OrderSchema } from '../order/order.model';

const RiderSchema = new Schema<IRider>(
  {
    hubId: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    riderImage: {
      type: String,
      required: true,
      default:
        'https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png',
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ['Car', 'Bike', 'Cycle'],
      required: true,
    },
    onlineStatus: {
      type: Boolean,
      required: true,
      default: true,
    },
    riderRating: {
      type: Number,
      default: 0,
      required: true,
    },
    currentOrderList: {
      type: [OrderSchema],
      ref: 'Order',
    },
    currentLatLong: {
      type: LongLatSchema,
      default: { longitude: -0.1445, latitude: 51.5145 },
    },
    hubLatLong: {
      type: LongLatSchema,
      default: { longitude: 0, latitude: 0 },
    },
    currentBagCapacity: {
      type: String,
      default: '50 X 50 X 60',
    },
    riderStates: {
      state0: {
        available: {
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
    routeSequence: {
      type: [Object],
      default: [],
    },
    travelTime: {
      type: Number,
      default: -1,
    },
  },
  { versionKey: false },
);

export const Rider = model<IRider>('Rider', RiderSchema);
