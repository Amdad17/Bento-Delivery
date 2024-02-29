import { Request, Response } from 'express';

import { IOrder, IItem } from '../Interfaces/IOrder';
import { IRider, IRiderOutput } from '../Interfaces/IRider';

type bagCapacityReqBody = {
  riders: IRider[];
  order: IOrder;
};

export const bagCapacityCheckerController = (req: Request, res: Response) => {
  try {
    const { riders } = req.body as bagCapacityReqBody;
    const { order } = req.body as bagCapacityReqBody;
    const newArr: IRiderOutput[] = [];

    for (let i = 0; i < riders.length; i++) {
      if (
        riders[i].currentOrderList.length === 1 &&
        order.orderTemperatureType === riders[i].currentOrderList[0].orderTemperatureType
      ) {
        let volume: number[] = [];
        volume = volumeCalculator(riders[i].currentBagCapacity, order.items);
        const [length, width, height] = volume;
        if (height > 0 && width > 0 && length) {
          const potentialBagCapacity = volume.join(' X ');
          newArr.push({ ...riders[i], potentialBagCapacity: potentialBagCapacity });
        }
      } else if (riders[i].currentOrderList.length === 0) {
        let volume: number[] = [];
        volume = volumeCalculator(riders[i].currentBagCapacity, order.items);
        const [length, width, height] = volume;
        if (height > 0 && width > 0 && length) {
          const potentialBagCapacity = volume.join(' X ');
          newArr.push({ ...riders[i], potentialBagCapacity: potentialBagCapacity });
        }
      }
    }
    res.status(201).json(newArr);
  } catch (error) {
    res.status(500);
    if (error instanceof Error) res.json({ message: error.message });
  }
};

function volumeCalculator(riderBagCapacity: string, items: IItem[]) {
  //Length x Width x Height
  const bagDimensionsArr = riderBagCapacity.split(' X ');
  const bagLength = parseInt(bagDimensionsArr[0]);
  let bagWidth = parseInt(bagDimensionsArr[1]);
  let bagHeight = parseInt(bagDimensionsArr[2]);

  for (let i = 0; i < items.length; i++) {
    const itemDimensionsArr = items[i].item.itemPackingType[0].dimensions.split(' X ');
    // const itemLength = parseInt(itemDimensionsArr[0]);
    let itemWidth = parseInt(itemDimensionsArr[1]);
    let itemHeight = parseInt(itemDimensionsArr[2]);

    if (itemHeight > itemWidth) {
      itemWidth *= items[i].item.itemQuantity;
      bagWidth -= itemWidth;
    } else {
      itemHeight *= items[i].item.itemQuantity;
      bagHeight -= itemHeight;
    }
  }
  return [bagLength, bagWidth, bagHeight];
}
