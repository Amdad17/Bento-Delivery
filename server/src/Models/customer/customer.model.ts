import { Schema, model } from 'mongoose';

import { ICustomer } from '../../interfaces/ICustomer';
import { CustomerPreferenceSchema } from '../helperSchemas/customerPreference.model';
import { LongLatSchema } from '../longLat/longLat.model';

const defaultCustomerPreferenceSchema = {
  tastyTags: {},
  category: [],
};

export const CustomerSchema: Schema<ICustomer> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    customerImage: {
      type: String,
      required: true,
      default:
        'https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png',
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    currentLatLong: {
      type: LongLatSchema,
    },
    doorwayLatLong: {
      type: LongLatSchema,
    },
    uprn: {
      type: String,
    },
    allOrderIdList: {
      type: [String],
      default: [],
    },
    customerPreference: {
      type: CustomerPreferenceSchema,
      default: defaultCustomerPreferenceSchema,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false, id: false },
);

CustomerSchema.virtual('age').get(function () {
  const dob: Date = this.dob;
  if (!dob) return undefined;
  const diff_ms: number = Date.now() - dob.getTime();
  const age_dt: Date = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
});

CustomerSchema.set('toJSON', { virtuals: true });

const Customer = model<ICustomer>('Customer', CustomerSchema);

export default Customer;
