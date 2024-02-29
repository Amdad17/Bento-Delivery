import { ICustomer } from './ICustomer';
import { ILongLat } from './ILongLat';
import { IOrder } from './IOrder';
import { IRestaurantShortInfo } from './IRestaurant';

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
  hubLatLong: ILongLat;
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
