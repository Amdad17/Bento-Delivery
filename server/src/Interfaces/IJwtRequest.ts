import { Request } from 'express';

export interface IJwtRequest extends Request {
  user?: {
    _id?: string;
    name: string;
    phoneNumber: string;
    email: string;
    vehicleType: string;
  };
}
