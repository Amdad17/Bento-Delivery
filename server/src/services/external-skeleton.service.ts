import axios from 'axios';

//eslint-disable-next-line
import { IRestaurant, IRestaurantShortInfo } from '../interfaces/IRestaurant';
import { IUtilizationData } from '../interfaces/IUtilizationData';
//eslint-disable-next-line
export async function getRestaurantShortInfo(resId?: number) {
  try {
    const response = await axios.get(
      `${process.env.SKELETON_BE_BASE_URL}/restaurants/one-restaurant/${resId}`,
    );

    const restaurant = (response.data as IRestaurant[])[0];
    const { restaurantId, restaurantName, address, restaurantLongitude, restaurantLatitude } =
      restaurant;

    const RestaurantShortInfo = {
      restaurantId,
      restaurantName,
      address,
      restaurantLongitude,
      restaurantLatitude,
    } as IRestaurantShortInfo;

    return RestaurantShortInfo;
  } catch (error) {
    console.error('Error fetching restaurant data from Skeleton:', error);
  }
}

export async function getAllUtilizationDatas() {
  try {
    const res = await axios.get(
      process.env.SKELETON_BE_BASE_URL + '/utilization/current/all/?delivery=true',
    );
    // eslint-disable-next-line
    return res.data.data as IUtilizationData[];
  } catch (error) {
    throw new Error('Error getting utilization datas from Skeleton.');
  }
}
