import { Types } from 'mongoose';

// MAIN IN THE FILE
export interface IOrder {
  _id?: string; // good to go
  riderId: Types.ObjectId; // need to be added
  userId: string; // good to go
  restaurantId: number; // good to go
  items: IItem[]; // good to go
  orderTemperatureType: string; // Enum[Hot, Cold]  // need to be added
  orderDeliveryTime: {
    minTime: Date;
    maxTime: Date;
  }; // need to be modified added
  deliveryFee: number; // good to go
  subtotal: number; // good to go
  createdAt: Date; // good to go
}

export interface IOption {
  id: number;
  ingredientName: string;
  unitOfStock: string;
  quantity: number;
  costPerUnit: number;
  caloriesPerUnit: number;
  price: string;
  _id: string;
}

export interface IIngredient {
  id: number;
  restaurantId?: number;
  ingredientName: string;
  unitOfStock: string;
  quantity: number;
  costPerUnit: number;
  caloriesPerUnit: number;
  _id: string;
}

export interface IPacking {
  id: number;
  boxName: string;
  currentStockQuantity: number;
  unitOfPrice: string;
  costPerUnit: number;
  reorderPoint: number;
  unitOfDimentions: string;
  dimensions: string;
  weightLimit: number;
  temperatureLimit: number;
  waterproof: string;
  expectedStockForToday: number;
  expectedStockForTomorrow: number;
  restaurantId: number;
  createdAt: Date;
  updatedAt: Date;
  quantity?: number;
}

export interface IRecipe {
  restaurantId: number;
  recipeId: number;
  recipeName: string;
  recipeItemPortionSize: number;
  recipeItemPreparationTime: number;
  recipeItemCost: number;
  recipeItemCalories: number;
  ingredients: IIngredient[];
  _id: string;
}

export interface IItem {
  _id: string;
  restaurantId: number;
  categoryId: string;
  mealTimeId: number;
  item: {
    _id: string;
    itemId: number;
    itemName: string;
    itemImage: string;
    itemDescription: string;
    itemQuantity: number;
    itemPreparationTime: number;
    itemPackingType: IPacking[];
    itemLastingTime: number;
    itemPortionSize: string;
    ingredients?: { rawIngredients: IIngredient[]; recipes: IRecipe[] };
    options?: { add: IOption[]; no: IOption[] };
    chosenOptions?: { add: IOption[]; no: IOption[] };
    optionalNotes?: string;
    discount?: number;
    isDisabled?: boolean;
    itemPrice: number;
    itemCalories: number;
    timeOfDay: string[];
    itemProfileTastyTags: string[];
    typeOfFoods: string[];
    servingTemperature: number;
    itemDietaryRestrictions: string[];
  };
}
