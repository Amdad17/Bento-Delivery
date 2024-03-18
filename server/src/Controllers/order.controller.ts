import { Request, Response } from 'express';

import { io } from '..';
import { IOrder } from '../interfaces/IOrder';
import {
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getAverageNumberOfOrdersOnCurrentDay,
  getOrderForecastFromToFrequencyMinutes,
  getTotalNumberOfOrdersOfToday,
  assignRiderToOrder,
  createOrder,
} from '../models/order/order.query';

export async function findAllOrders(req: Request, res: Response) {
  try {
    const orders = await getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

export async function getOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

export async function updateOrderDetails(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updatedOrder = await updateOrder(id, req.body as IOrder);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

export async function removeOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deletedOrder = await deleteOrder(id);
    res.status(200).json(deletedOrder);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

export async function createNewOrder(req: Request, res: Response) {
  try {
    const newOrder = await assignRiderToOrder(req.body as IOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

export async function getAverageOrdersOnCurrentDay(req: Request, res: Response) {
  try {
    const { riderId } = req.params as { riderId: string };
    const averageOrders = await getAverageNumberOfOrdersOnCurrentDay(riderId);
    res.status(200).json(averageOrders);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

export async function getOrderForecast(req: Request, res: Response) {
  try {
    const { restaurantId, minutes } = req.query as { restaurantId: string; minutes: string };
    const forecast = await getOrderForecastFromToFrequencyMinutes(
      Number(restaurantId),
      Number(minutes),
    );
    res.status(200).json(forecast);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

export async function getTotalOrdersOfToday(req: Request, res: Response) {
  try {
    const { riderId } = req.params as { riderId: string };
    const totalOrders = await getTotalNumberOfOrdersOfToday(riderId);
    res.status(200).json(totalOrders);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

// THIS FUNCTION IS OBSOLETE NOW. ORDER IS COMING FROM MARKETPLACE VIA services > orderFromMarketplaceMQ.service.ts
export const getOrderDetailsFromMarketPlace = async (req: Request, res: Response) => {
  try {
    let isProcessingOrder = false;
    const newOrder = req.body as IOrder;
    console.log(newOrder);
    // Check if an order is already being processed
    if (!isProcessingOrder) {
      isProcessingOrder = true;
      const updatedOrder = await assignRiderToOrder(newOrder);
      if (updatedOrder) {
        const riderSideOrder = await createOrder(updatedOrder);
        console.log('riderSideOrder', riderSideOrder);
      }
      // Emit the 'riderFound' event
      io.emit('riderFound', updatedOrder);
      console.log('isProcessing', isProcessingOrder);
      // Reset the processing flag after a delay (e.g., 1 minute)
      setTimeout(() => {
        isProcessingOrder = false;
      }, 3000); // 60000 milliseconds = 1 minute
      res.status(201).json(updatedOrder);
    } else {
      // If an order is already being processed, return a 429 Too Many Requests status
      res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }
  } catch (error) {
    console.log('Error getting Order From Marketplace', error);
    console.error('Error getting Order From Marketplace', error);
  }
};

// export const getOrderDetailsFromMarketPlace = async (req: Request, res: Response) => {
//   try {
//     const newOrder = req.body as IOrder;
//     console.log(newOrder);
//     const updatedOrder = await assignRiderToOrder(newOrder);
//     io.emit('riderFound', updatedOrder);
//     res.status(201).json(updatedOrder);
//   } catch (error) {
//     console.log(error);
//     throw new Error((error as Error).message);
//   }
// };
