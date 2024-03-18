import { IOrder } from '../interfaces/IOrder';

export function calculateDeliveryTime(order: IOrder) {
  let maxPreparationTime = 0;
  let minLastingTime = 0;
  if (order.items[0].item.itemLastingTime) {
    minLastingTime = order.items[0].item.itemLastingTime;
  }

  for (let i = 0; i < order.items.length; i++) {
    if (order.items[i].item.itemPreparationTime > maxPreparationTime) {
      maxPreparationTime = order.items[i].item.itemPreparationTime;
    }
    if (order.items[i].item.itemLastingTime < minLastingTime) {
      minLastingTime = order.items[i].item.itemLastingTime;
    }
  }

  const totalMinutesForMin = maxPreparationTime + minLastingTime - 20;
  const totalMinutesForMax = maxPreparationTime + minLastingTime - 10;
  console.log(totalMinutesForMin);

  const currentDate = new Date(Date.now());

  order.orderDeliveryTime.minTime.setMinutes(currentDate.getMinutes() + totalMinutesForMin);
  order.orderDeliveryTime.maxTime.setMinutes(currentDate.getMinutes() + totalMinutesForMax);

  return order;
}

export function calculateMaxPreparationTime(order: IOrder) {
  let maxPreparationTime = 0;

  for (let i = 0; i < order.items.length; i++) {
    if (order.items[i].item.itemPreparationTime > maxPreparationTime) {
      maxPreparationTime = order.items[i].item.itemPreparationTime;
    }
  }

  const currentDate = new Date(Date.now());
  const preparationTime = new Date(currentDate.getTime() + maxPreparationTime * 60000);

  return preparationTime;
}
