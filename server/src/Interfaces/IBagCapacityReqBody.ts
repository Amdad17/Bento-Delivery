import { IOrder } from './IOrder';
import { IRider } from './IRider';

export interface IBagCapacityReqBody {
  riders: IRider[];
  order: IOrder;
}
