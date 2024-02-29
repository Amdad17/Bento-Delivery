import axios from 'axios';

//eslint-disable-next-line
import { IRestaurant, IRestaurantShortInfo } from '../Interfaces/IRestaurant';
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

    // const RestaurantShortInfo = {
    //   restaurantId: 1,
    //   restaurantName: 'Test Restaurant',
    //   address: 'Test Address',
    //   restaurantLongitude: -0.21275,
    //   restaurantLatitude: 51.554757,
    // } as IRestaurantShortInfo;

    return RestaurantShortInfo;
  } catch (error) {
    console.log('Error fetching restaurant data from Skeleton:', error);
    console.error('Error fetching restaurant data from Skeleton:', error);
  }
}
