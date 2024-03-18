import { Schema } from 'mongoose';

import { IOption } from '../../interfaces/IOrder';

export const optionSchema: Schema<IOption> = new Schema({
  id: { type: Number, required: true },
  ingredientName: { type: String, required: true },
  unitOfStock: { type: String, required: true },
  quantity: { type: Number, required: true },
  costPerUnit: { type: Number, required: true },
  caloriesPerUnit: { type: Number, required: true },
  price: { type: String, required: true },
  _id: { type: String, required: true },
});
