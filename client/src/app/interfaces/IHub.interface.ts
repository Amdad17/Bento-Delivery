export interface IHub {
  _id?: string;
  capacity: number;
  riders: IRider[];
  restaurants: IUtilizationData[];
  center: number[];
  status: string;
}

export interface IRestaurantUtilizationData {
  restaurantId: number;
  utilizationRate: number;
  timestamp: Date;
}

export interface IUtilizationData {
  _id: string;
  restaurantId: number;
  utilization: number;
  level: string; //LU, MU, HU
  restaurantName: string;
  restaurantLongitude: number;
  restaurantLatitude: number;
  address: string;
  country: {
    countryCode: string;
    countryName: string;
    zoneName: string;
    gmtOffset: number;
    timestamp: number;
  };
  rating: number;
  priceRange: string;
  delivery: boolean;
  deliveryTimeStart: Date;
  deliveryTimeEnd: Date;
  operatingDays: string[];
  operationOpeningTime: Date;
  operationClosingTime: Date;
}

export interface IRider {
  _id?: string;
  hubId?: string | null;
  name: string;
  riderImage: string;
  phoneNumber: string;
  email: string;
  password: string;
  vehicleType: string; // Enum [Car, Bike, Cycle]
  onlineStatus: boolean;
  riderRating: number;
  currentOrderList: IOrder[];
  currentLatLong: ILongLat;
  currentBagCapacity: string; //Length X Width X Height
  riderStates: IRiderStates;
  routeSequence: SequenceObject[];
  travelTime: number;
}

export interface IRiderOutput extends IRider {
  potentialBagCapacity: string; //Length X Width X Height
}

export interface IRiderStates {
  state0: {
    available: boolean;
  };
  state1: {
    completed: boolean;
    restaurant1?: IRestaurantShortInfo | null;
  };
  state2: {
    completed: boolean;
    restaurant2?: IRestaurantShortInfo | null;
  };
  state3: {
    completed: boolean;
    customer1?: ICustomer | null;
  };
  state4: {
    completed: boolean;
    customer2?: ICustomer | null;
  };
}

export interface SequenceObject {
  sequence: string;
  travelTime: number;
  maxTime: Date;
}

export interface ICustomer {
  _id?: string;
  name: string;
  email: string;
  dob: Date;
  age?: number;
  customerImage?: string;
  phoneNumber: string;
  password: string;
  address: string;
  currentLatLong?: ILongLat;
  doorwayLatLong?: ILongLat;
  uprn?: string;
  allOrderIdList: string[];
  customerPreference: ICustomerPreference; // Tasty Tag Enums from Menu and category
  loyaltyPoints?: number;
}

export interface ICustomerPreference {
  tastyTags: string[];
  category: string[];
}

export interface IRestaurantShortInfo {
  restaurantId: number;
  restaurantName: string;
  restaurantLongitude: number;
  restaurantLatitude: number;
}

export interface ILongLat {
  longitude: number;
  latitude: number;
}

// MAIN IN THE FILE
export interface IOrder {
  _id?: string; // good to go
  riderId: string; // need to be added
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

export interface HubResponse {
  riderId: string;
  hubId: string;
  center: ILongLat;
}
