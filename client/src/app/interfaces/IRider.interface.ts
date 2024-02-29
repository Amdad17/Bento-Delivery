export interface RiderInfo {
  rider: {
    _id?: string;
    hubId?: string;
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
    hubLatLong?: ILongLat;
    currentBagCapacity: string; //Length X Width X Height
    riderStates: IRiderStates;
    routeSequence: SequenceObject[];
    travelTime: number;
  };
}

interface IOrder {
  orderDeliveryTime: {
    minTime: string;
    maxTime: string;
  };
  riderId: string;
  userId: string;
  restaurantId: number;
  deliveryFee: number;
  items: {
    item: {
      _id: string;
      itemId: number;
      itemName: string;
      itemImage: string;
      itemDescription: string;
      itemQuantity: number;
      itemPreparationTime: number;
      itemLastingTime: number;
      itemPortionSize: string;
      optionalNotes: string;
      discount: number;
      isDisabled: boolean;
      itemPrice: number;
      itemCalories: number;
      timeOfDay: string[];
      itemProfileTastyTags: string[];
      typeOfFoods: string[];
      servingTemperature: number;
      itemDietaryRestrictions: string[];
      itemPackingType: {
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
        createdAt: string;
        updatedAt: string;
        quantity: number;
        _id: string;
      }[];
      ingredients: {
        rawIngredients: []; // Assuming this is an array of some specific type
        recipes: []; // Assuming this is an array of some specific type
        _id: string;
      };
      options: {
        add: []; // Assuming this is an array of some specific type
        no: []; // Assuming this is an array of some specific type
        _id: string;
      };
      chosenOptions: {
        add: []; // Assuming this is an array of some specific type
        no: []; // Assuming this is an array of some specific type
        _id: string;
      };
    };
    _id: string;
    restaurantId: number;
    categoryId: string;
    mealTimeId: number;
  }[];
  orderTemperatureType: string;
  orderRoute: []; // Assuming this is an array of some specific type
  deliveryPoint: {
    longitude: number;
    latitude: number;
  };
  subtotal: number;
  orderStatus: string;
  ordertype: string;
  delivery: boolean;
  pickup: boolean;
  createdAt: string;
  orderCompletedAt: string | null;
  _id: string;
}

export interface IRiderStates {
  state0: {
    completed: boolean;
  };
  state1: {
    completed: boolean;
    restaurant1?: IRestaurantShortInfo;
  };
  state2: {
    completed: boolean;
    restaurant2?: IRestaurantShortInfo;
  };
  state3: {
    completed: boolean;
    customer1?: ICustomer;
  };
  state4: {
    completed: boolean;
    customer2?: ICustomer;
  };
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
  address: string;
  restaurantName: string;
  restaurantLongitude: number;
  restaurantLatitude: number;
}

export interface ILongLat {
  longitude: number;
  latitude: number;
}

export interface IState {
  type: string;
  coordinates: (number | undefined)[];
}

export interface IAllRoutes {
  [key: string]: {
    type: string;
    coordinates: [number, number];
    // state1?: IState;
    // state2?: IState;
    // state3?: IState;
    // state4?: IState;
  };
}

export interface Entity {
  currentLatLong?: {
    longitude: number;
    latitude: number;
  };
}

export type StateType = 'Restaurant' | 'Customer';

export interface State {
  type: StateType;
  entityType: string;
  coordinates: [number | null, number | null] | null;
}

export interface IDoorwayRoutes {
  [key: string]: {
    type: string;
    customerCoordinates: [number, number];
    doorwayCoordinates: [number, number];
    // state1?: IState;
    // state2?: IState;
    // state3?: IState;
    // state4?: IState;
  };
}

export interface SequenceObject {
  sequence: string;
  travelTime: number;
  maxTime: Date;
}

export interface ISequenceRoutes {}
