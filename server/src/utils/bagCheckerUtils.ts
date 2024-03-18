import { IItem, IOrder } from '../interfaces/IOrder';
import { IRider, IRiderOutput } from '../interfaces/IRider';

export const bagCapacityCheckerController = (riders: IRider[], order: IOrder) => {
  try {
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
    return newArr;
  } catch (error) {
    console.error(error);
    throw new Error('Error in bagCapacityCheckerController');
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
