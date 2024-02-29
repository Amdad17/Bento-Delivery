import { Types } from 'mongoose';

import { IRider } from './IRider';
import { IUtilizationData } from './IUtilizationData';

export interface IHub {
  _id?: Types.ObjectId | string;
  capacity: number;
  riders: IRider[];
  restaurants: IUtilizationData[];
  center: number[];
  status: string;
}
