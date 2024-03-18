import { Schema } from 'mongoose';

import { ICustomerPreference } from '../../interfaces/ICustomer';

export const TastyTagsSchema = new Schema(
  {
    tastyTags: {
      type: Map,
      of: Number,
    },
  },
  { _id: false },
);

export const CustomerPreferenceSchema = new Schema<ICustomerPreference>(
  {
    tastyTags: {
      type: TastyTagsSchema,
    },
    category: {
      type: [String],
    },
  },
  { _id: false },
);
