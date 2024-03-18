import express from 'express';

import {
  findAllOrders,
  getOrder,
  updateOrderDetails,
  removeOrder,
  createNewOrder,
  getAverageOrdersOnCurrentDay,
  getOrderForecast,
  getTotalOrdersOfToday,
  getOrderDetailsFromMarketPlace,
} from '../controllers/order.controller';

const orderRouter = express.Router();

orderRouter.get('/all', findAllOrders);
orderRouter.post('/', createNewOrder);
orderRouter.delete('/:id', removeOrder);
orderRouter.put('/:id', updateOrderDetails);
orderRouter.get('/:id', getOrder);
orderRouter.get('/ordersOnSaturday/:riderId', getAverageOrdersOnCurrentDay);
orderRouter.get('/orderForecast/:restaurantId/:minutes', getOrderForecast);
orderRouter.get('/totalOrdersOnCurrentDay/:riderId', getTotalOrdersOfToday);
orderRouter.post('/orderDetails', getOrderDetailsFromMarketPlace);

export default orderRouter;
