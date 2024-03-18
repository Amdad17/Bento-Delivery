import { Schema } from 'mongoose';

import { IItem } from '../../interfaces/IOrder';

import { packingSchema } from './packingSchema.model';

export const itemSchema: Schema<IItem> = new Schema({
  _id: { type: String },
  restaurantId: { type: Number },
  categoryId: { type: String },
  mealTimeId: { type: Number },
  item: {
    _id: { type: String },
    itemId: { type: Number },
    itemName: { type: String },
    itemImage: { type: String },
    itemDescription: { type: String },
    itemQuantity: { type: Number },
    itemPreparationTime: { type: Number },
    itemLastingTime: { type: Number },
    itemPortionSize: { type: String },
    optionalNotes: { type: String },
    discount: { type: Number },
    isDisabled: { type: Boolean },
    itemPrice: { type: Number },
    itemCalories: { type: Number },
    timeOfDay: { type: [String] },
    itemProfileTastyTags: { type: [String] },
    typeOfFoods: { type: [String] },
    servingTemperature: { type: Number },
    itemDietaryRestrictions: { type: [String] },
    itemPackingType: { type: [packingSchema] },
  },
});
