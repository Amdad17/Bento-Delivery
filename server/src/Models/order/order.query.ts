import mongoose from 'mongoose';

import { IOrder } from '../../interfaces/IOrder';
import { IRider } from '../../interfaces/IRider';
import {
  getSequenceForOneOrders,
  getSequenceForTwoOrders,
} from '../../services/external-mapbox.service';
import { getCustomerInfoFromMarketPlace } from '../../services/external-marketplace.service';
import { getRestaurantShortInfo } from '../../services/external-skeleton.service';
import { searchRiderForOrder } from '../../utils/riderUtils';
import { getRiderById, updateRider } from '../rider/rider.query';

import Order from './order.model';

export const getAllOrders = async () => {
  try {
    return await Order.find();
  } catch (error) {
    console.error('Error getting all orders', error);
  }
};

export const getOrderById = async (id: string) => {
  try {
    return await Order.findById(id);
  } catch (error) {
    console.error('Error getting order by id', error);
  }
};

export const updateOrder = async (id: string, order: IOrder) => {
  try {
    return await Order.findByIdAndUpdate(id, order, { new: true });
  } catch (error) {
    console.error('Error updating order by id', error);
  }
};

export const deleteOrder = async (id: string) => {
  try {
    return await Order.findByIdAndDelete(id);
  } catch (error) {
    console.error('Error deleting order by id', error);
  }
};

export const createOrder = async (order: IOrder) => {
  try {
    const newOrder = await Order.create(order);
    return newOrder;
  } catch (error) {
    console.error('Error creating order', error);
  }
};

export const getOrderForecastFromToFrequencyMinutes = async (
  restaurantId: number,
  minutes: number,
) => {
  try {
    const now = new Date();
    const endTime = new Date(now.getTime() + minutes * 60000);
    const currentDayOfWeek = now.getDay() + 1;

    const result = await Order.aggregate([
      {
        $match: {
          restaurantId: restaurantId,
          orderPlacingTime: {
            $gte: now,
            $lt: endTime,
          },
          $expr: { $eq: [{ $dayOfWeek: '$orderPlacingTime' }, currentDayOfWeek] },
        },
      },
      {
        $group: {
          _id: { $week: '$orderPlacingTime' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          totalDays: { $sum: 1 },
          totalOrders: { $sum: '$count' },
        },
      },
      {
        $project: {
          average: { $divide: ['$totalOrders', '$totalDays'] },
        },
      },
    ]);

    return result.length > 0 ? (result[0] as { count: number }).count : 0;
  } catch (error) {
    console.error('Error getting order forecast', error);
  }
};

export const getAverageNumberOfOrdersOnCurrentDay = async (riderId: string) => {
  try {
    const currentDayOfWeek = new Date().getDay() + 1;

    const result = await Order.aggregate([
      {
        $match: {
          riderId: new mongoose.Types.ObjectId(riderId),
          $expr: { $eq: [{ $dayOfWeek: '$orderPlacingTime' }, currentDayOfWeek] },
        },
      },
      {
        $group: {
          _id: { $week: '$orderPlacingTime' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          totalDays: { $sum: 1 },
          totalOrders: { $sum: '$count' },
        },
      },
      {
        $project: {
          average: { $divide: ['$totalOrders', '$totalDays'] },
        },
      },
    ]);

    return result.length > 0 ? (result[0] as { average: number }).average : 0;
  } catch (error) {
    console.error('Error getting average number of orders on current day', error);
  }
};

export const getTotalNumberOfOrdersOfToday = async (riderId: string) => {
  try {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const result = await Order.aggregate([
      {
        $match: {
          riderId: new mongoose.Types.ObjectId(riderId),
          orderPlacingTime: {
            $gte: start,
            $lt: end,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
        },
      },
    ]);
    console.log(result);
    return result.length > 0 ? (result[0] as { totalOrders: number }).totalOrders : 0;
  } catch (error) {
    console.error('Error getting all number of orders', error);
  }
};

export const assignRiderToOrder = async (order: IOrder) => {
  try {
    const newOrder = order;

    if (!newOrder) {
      console.log('Error creating order');
      return null;
    }
    //eslint-disable-next-line
    const restaurantShortInfo = await getRestaurantShortInfo(newOrder.restaurantId);

    if (!restaurantShortInfo) {
      console.log('Error fetching restaurant data from Skeleton');
      return null;
    }

    const customerInfo = await getCustomerInfoFromMarketPlace(newOrder.userId);

    if (!customerInfo) {
      console.log('Error fetching customer data from Marketplace');
      return null;
    }

    const findRiderForOrder = await searchRiderForOrder(
      restaurantShortInfo.restaurantLongitude,
      restaurantShortInfo.restaurantLatitude,
      15,
    );

    if (!findRiderForOrder) {
      console.log('No rider found for the order');
      return null;
    }

    newOrder.riderId = new mongoose.Types.ObjectId(findRiderForOrder._id);

    findRiderForOrder.currentOrderList.push(newOrder);
    findRiderForOrder.travelTime = -1;

    if (findRiderForOrder.riderStates.state1.restaurant1) {
      findRiderForOrder.riderStates.state0.available = false;
      findRiderForOrder.riderStates.state2.restaurant2 = restaurantShortInfo;
      findRiderForOrder.riderStates.state4.customer2 = customerInfo;
      findRiderForOrder.routeSequence = await getSequenceForTwoOrders(findRiderForOrder);
      console.log(customerInfo);
    } else {
      findRiderForOrder.riderStates.state1.restaurant1 = restaurantShortInfo;
      findRiderForOrder.riderStates.state3.customer1 = customerInfo;
      findRiderForOrder.routeSequence = await getSequenceForOneOrders(findRiderForOrder);
      console.log(customerInfo);
    }

    console.log('Found rider:', findRiderForOrder);
    if (findRiderForOrder._id) {
      const updatedRider = await updateRider(findRiderForOrder._id, findRiderForOrder);
      console.log('updatedRider', updatedRider);
      if (updatedRider?._id) {
        // eslint-disable-next-line
        const searchedRider = (await getRiderById(updatedRider._id)) as IRider;
        console.log('LOOK OVER HERE!!!!! =======>', searchedRider);
      }
    }

    return newOrder;
  } catch (error) {
    console.error('Error assigning rider to order', error);
  }
};
