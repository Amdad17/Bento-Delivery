import { Schema } from 'mongoose';

import { IPacking } from '../../interfaces/IOrder';

export const packingSchema: Schema<IPacking> = new Schema({
  id: { type: Number, required: true },
  boxName: { type: String, required: true },
  currentStockQuantity: { type: Number, required: true },
  unitOfPrice: { type: String, required: true },
  costPerUnit: { type: Number, required: true },
  reorderPoint: { type: Number, required: true },
  unitOfDimentions: { type: String, required: true },
  dimensions: { type: String, required: true },
  weightLimit: { type: Number, required: true },
  temperatureLimit: { type: Number, required: true },
  waterproof: { type: String, required: true },
  expectedStockForToday: { type: Number, required: true },
  expectedStockForTomorrow: { type: Number, required: true },
  restaurantId: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  quantity: { type: Number },
});
