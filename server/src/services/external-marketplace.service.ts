import axios from 'axios';

import { ICustomer } from '../interfaces/ICustomer';
import { IOrder } from '../interfaces/IOrder';

export async function getCustomerInfoFromMarketPlace(customerId: string) {
  try {
    const response = await axios.get(
      `${process.env.MARKETPLACE_BE_BASE_URL}/user-details/${customerId}`,
    );

    const restaurant = response.data as ICustomer;
    console.log(restaurant);
    return restaurant;
  } catch (error) {
    console.error('Error fetching customer data from Marketplace:', error);
  }
}

export async function updateOrderInfoInMarketPlace(order: IOrder) {
  try {
    const { _id, riderId } = order;

    const orderId = _id;
    const shortOrderInfo = {
      orderId,
      riderId,
    };

    const response = await axios.put(
      `${process.env.MARKETPLACE_BE_BASE_URL}/assign-rider`,
      shortOrderInfo,
    );

    const updatedOrder = response.data as IOrder;

    return updatedOrder;
  } catch (error) {
    console.error('Error updating order data in Marketplace:', error);
    return null;
  }
}
