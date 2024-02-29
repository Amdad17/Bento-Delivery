import { ILongLat } from './ILongLat';

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

export interface TastyTags {
  [tagName: string]: number;
}

export interface ICustomerPreference {
  tastyTags: TastyTags;
  category: string[];
}

export interface ICustomerSignup {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  dob: string;
  address: string;
  customerImage?: string;
  customerPreference: ICustomerPreference;
  allOrderIdList: string[];
  loyaltyPoints?: number;
  currentLatLong?: ILongLat;
  doorwayLatLong?: ILongLat;
  uprn?: string;
}
