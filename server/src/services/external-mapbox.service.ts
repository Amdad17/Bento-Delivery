import axios from 'axios';

import {
  DistanceDurationResponse,
  IFeatureCollection,
  MapboxDirection,
} from '../interfaces/IMapBox';
import { IRider } from '../interfaces/IRider';
import { getAvailableRiders } from '../models/rider/rider.query';
import { formatDateToString } from '../utils/formatDateUtils';
import { calculateMaxPreparationTime } from '../utils/orderUtils';
import { convertRidersToCoordinates, isPointInsidePolygon } from '../utils/riderUtils';

export async function getAllPotentialRidersOfIsochrone(
  lat: number,
  long: number,
  vehicle: string,
  timeRange: number,
) {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/isochrone/v1/mapbox/${vehicle}/${long},${lat}?contours_minutes=${timeRange}&contours_colors=6706ce&polygons=true&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
    );

    let availableRiders = await getAvailableRiders();

    if (!availableRiders) {
      console.log('No available riders');
      return [];
    }

    const riderType = vehicle === 'cycling' ? 'Cycle' : 'Bike';

    availableRiders = availableRiders.filter(
      rider =>
        rider.currentOrderList.length < 2 &&
        isPointInsidePolygon(
          (response.data as IFeatureCollection).features[0].geometry.coordinates,
          rider.currentLatLong.latitude,
          rider.currentLatLong.longitude,
        ) &&
        rider.riderStates.state0.available &&
        rider.vehicleType === riderType,
    );

    const ridersInAscending = await getAllRidersInAscendingOrder(
      availableRiders,
      vehicle,
      lat,
      long,
      0,
    );

    return ridersInAscending;
  } catch (error) {
    console.error('Error getting all potential riders from Isochrome', error);
  }
}

export async function getAllRidersInAscendingOrder2(
  availableRiders: IRider[],
  vehicle: string,
  lat: number,
  long: number,
  sourcesPosition: number,
) {
  try {
    const coordinates = convertRidersToCoordinates(availableRiders);

    if (!coordinates) {
      return [];
    }

    const response = await axios.get(
      `https://api.mapbox.com/directions-matrix/v1/mapbox/${vehicle}/${long},${lat};${coordinates}?sources=${String(sourcesPosition)}&annotations=distance,duration&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
    );

    for (let i = 0; i < availableRiders.length; i++) {
      availableRiders[i].travelTime = (response.data as DistanceDurationResponse).durations[0][
        i + 1
      ];
    }

    availableRiders.sort((rider1: IRider, rider2: IRider) => {
      return rider1.travelTime - rider2.travelTime;
    });

    return availableRiders;
  } catch (error) {
    console.error('Error getting all riders in ascending order', error);
  }
}

export async function getAllRidersInAscendingOrder(
  availableRiders: IRider[],
  vehicle: string,
  lat: number,
  long: number,
  sourcesPosition: number,
) {
  try {
    if (!availableRiders.length) {
      throw new Error('No riders available.');
    }

    const maxRiderPerRequest = 24;
    let riderCount = 0;
    const riderList: IRider[] = [];

    while (riderCount < availableRiders.length) {
      const riders = availableRiders.slice(riderCount, riderCount + maxRiderPerRequest);
      const coordinates = convertRidersToCoordinates(riders);
      const response = await axios
        .get<DistanceDurationResponse>(
          `https://api.mapbox.com/directions-matrix/v1/mapbox/${vehicle}/${long},${lat};${coordinates}?sources=${String(sourcesPosition)}&annotations=distance,duration&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
        )
        .catch(error => {
          console.error('Error making request to Mapbox API', error);
          throw error;
        });

      for (let i = 0; i < riders.length; i++) {
        riders[i].travelTime = response.data.durations[0][i + 1];
      }

      riderList.push(...riders);
      riderCount += maxRiderPerRequest;
    }

    riderList.sort((rider1: IRider, rider2: IRider) => rider1.travelTime - rider2.travelTime);

    return riderList;
  } catch (error) {
    console.error('Error getting all riders in ascending order', error);
    throw error;
  }
}

export async function getSequenceForTwoOrders(rider: IRider) {
  try {
    let coordinates = '';
    coordinates += `${rider.currentLatLong.longitude},${rider.currentLatLong.latitude};`;
    if (rider.riderStates.state1.restaurant1) {
      coordinates += `${rider.riderStates.state1.restaurant1.restaurantLongitude},${rider.riderStates.state1.restaurant1.restaurantLatitude};`;
    }
    if (rider.riderStates.state2.restaurant2) {
      coordinates += `${rider.riderStates.state2.restaurant2.restaurantLongitude},${rider.riderStates.state2.restaurant2.restaurantLatitude};`;
    }
    if (rider.riderStates.state3.customer1 && rider.riderStates.state3.customer1.currentLatLong) {
      coordinates += `${rider.riderStates.state3.customer1.currentLatLong.longitude},${rider.riderStates.state3.customer1.currentLatLong.latitude};`;
    }
    if (rider.riderStates.state4.customer2 && rider.riderStates.state4.customer2.currentLatLong) {
      coordinates += `${rider.riderStates.state4.customer2.currentLatLong.longitude},${rider.riderStates.state4.customer2.currentLatLong.latitude}`;
    }

    const vehicle = rider.vehicleType === 'Cycle' ? 'cycling' : 'driving';

    const response = await axios.get(
      `https://api.mapbox.com/directions-matrix/v1/mapbox/${vehicle}/${coordinates}?approaches=curb;curb;curb;curb;curb&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
    );
    const maxPreparaionTimeOfOrder1 = calculateMaxPreparationTime(rider.currentOrderList[0]);
    const maxPreparaionTimeOfOrder2 = calculateMaxPreparationTime(rider.currentOrderList[1]);
    const maxDeliveryTimeOfOrder1 = rider.currentOrderList[0].orderDeliveryTime.maxTime;
    const maxDeliveryTimeOfOrder2 = rider.currentOrderList[1].orderDeliveryTime.maxTime;

    const currentDate = new Date(Date.now());
    const maxPreparaionTimeOfOrder1InSeconds =
      (maxPreparaionTimeOfOrder1.getTime() - currentDate.getTime()) / 1000;
    const maxPreparaionTimeOfOrder2InSeconds =
      (maxPreparaionTimeOfOrder2.getTime() - currentDate.getTime()) / 1000;

    const sequenceList = ['rider'];
    const sequenceTravelTime = [0];
    const directionMatrix = response.data as MapboxDirection;

    for (let i = 0; i < directionMatrix.durations.length; i++) {
      directionMatrix.durations[i][1] += maxPreparaionTimeOfOrder1InSeconds;
      directionMatrix.durations[i][2] += maxPreparaionTimeOfOrder2InSeconds;
    }

    if (directionMatrix.durations[0][1] < directionMatrix.durations[0][2]) {
      // rider start from restaurant1
      sequenceList.push('restaurant1');
      sequenceTravelTime.push(directionMatrix.durations[0][1] - maxPreparaionTimeOfOrder1InSeconds);
      if (directionMatrix.durations[1][2] < directionMatrix.durations[1][3]) {
        sequenceList.push('restaurant2');
        sequenceTravelTime.push(
          directionMatrix.durations[1][2] - maxPreparaionTimeOfOrder2InSeconds,
        );
        if (directionMatrix.durations[2][3] < directionMatrix.durations[2][4]) {
          sequenceList.push('customer1');
          sequenceTravelTime.push(directionMatrix.durations[2][3]);
          sequenceList.push('customer2');
          sequenceTravelTime.push(directionMatrix.durations[3][4]);
        } else {
          sequenceList.push('customer2');
          sequenceTravelTime.push(directionMatrix.durations[2][4]);
          sequenceList.push('customer1');
          sequenceTravelTime.push(directionMatrix.durations[4][3]);
        }
      } else {
        sequenceList.push('customer1');
        sequenceTravelTime.push(directionMatrix.durations[1][3]);
        sequenceList.push('restaurant2');
        sequenceTravelTime.push(
          directionMatrix.durations[3][2] - maxPreparaionTimeOfOrder2InSeconds,
        );
        sequenceList.push('customer2');
        sequenceTravelTime.push(directionMatrix.durations[2][4]);
      }
    } else {
      // rider start from restaurant2
      sequenceList.push('restaurant2');
      sequenceTravelTime.push(directionMatrix.durations[0][2] - maxPreparaionTimeOfOrder2InSeconds);
      if (directionMatrix.durations[2][1] < directionMatrix.durations[2][4]) {
        sequenceList.push('restaurant1');
        sequenceTravelTime.push(
          directionMatrix.durations[2][1] - maxPreparaionTimeOfOrder1InSeconds,
        );
        if (directionMatrix.durations[1][3] < directionMatrix.durations[1][4]) {
          sequenceList.push('customer1');
          sequenceTravelTime.push(directionMatrix.durations[1][3]);
          sequenceList.push('customer2');
          sequenceTravelTime.push(directionMatrix.durations[3][4]);
        } else {
          sequenceList.push('customer2');
          sequenceTravelTime.push(directionMatrix.durations[1][4]);
          sequenceList.push('customer1');
          sequenceTravelTime.push(directionMatrix.durations[4][3]);
        }
      } else {
        sequenceList.push('customer2');
        sequenceTravelTime.push(directionMatrix.durations[2][4]);
        sequenceList.push('restaurant1');
        sequenceTravelTime.push(
          directionMatrix.durations[4][1] - maxPreparaionTimeOfOrder1InSeconds,
        );
        sequenceList.push('customer1');
        sequenceTravelTime.push(directionMatrix.durations[1][3]);
      }
    }

    const sequenceObjectList = [];

    for (let i = 0; i < sequenceList.length; i++) {
      const sequenceObject = {
        sequence: sequenceList[i],
        travelTime: sequenceTravelTime[i],
        maxTime: new Date(Date.now()),
      };
      if (sequenceList[i] === 'restaurant1') {
        sequenceObject.maxTime = maxPreparaionTimeOfOrder1;
      } else if (sequenceList[i] === 'restaurant2') {
        sequenceObject.maxTime = maxPreparaionTimeOfOrder2;
      } else if (sequenceList[i] === 'customer1') {
        sequenceObject.maxTime = maxDeliveryTimeOfOrder1;
      } else if (sequenceList[i] === 'customer2') {
        sequenceObject.maxTime = maxDeliveryTimeOfOrder2;
      }
      console.log(formatDateToString(sequenceObject.maxTime));
      sequenceObjectList.push(sequenceObject);
    }
    console.log(sequenceObjectList);

    return sequenceObjectList;
  } catch (error) {
    console.log('Error getting sequence for two orders', error);
    throw new Error('Error getting sequence for two orders');
  }
}

export async function getSequenceForOneOrders(rider: IRider) {
  try {
    let coordinates = '';
    coordinates += `${rider.currentLatLong.longitude},${rider.currentLatLong.latitude};`;
    if (rider.riderStates.state1.restaurant1) {
      coordinates += `${rider.riderStates.state1.restaurant1.restaurantLongitude},${rider.riderStates.state1.restaurant1.restaurantLatitude};`;
    }
    if (rider.riderStates.state3.customer1 && rider.riderStates.state3.customer1.currentLatLong) {
      coordinates += `${rider.riderStates.state3.customer1.currentLatLong.longitude},${rider.riderStates.state3.customer1.currentLatLong.latitude}`;
    }

    const vehicle = rider.vehicleType === 'Cycle' ? 'cycling' : 'driving';

    const response = await axios.get(
      `https://api.mapbox.com/directions-matrix/v1/mapbox/${vehicle}/${coordinates}?approaches=curb;curb;curb&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
    );

    const sequenceList = ['rider'];
    const sequenceTravelTime = [0];
    const directionMatrix = response.data as MapboxDirection;

    sequenceList.push('restaurant1');
    sequenceTravelTime.push(directionMatrix.durations[0][1]);
    sequenceList.push('customer1');
    sequenceTravelTime.push(directionMatrix.durations[1][2]);

    const maxPreparaionTimeOfOrder1 = calculateMaxPreparationTime(rider.currentOrderList[0]);
    const maxDeliveryTimeOfOrder1 = rider.currentOrderList[0].orderDeliveryTime.maxTime;

    const sequenceObjectList = [];

    for (let i = 0; i < sequenceList.length; i++) {
      const sequenceObject = {
        sequence: sequenceList[i],
        travelTime: sequenceTravelTime[i],
        maxTime: new Date(Date.now()),
      };
      if (sequenceList[i] === 'restaurant1') {
        sequenceObject.maxTime = maxPreparaionTimeOfOrder1;
      } else if (sequenceList[i] === 'customer1') {
        sequenceObject.maxTime = maxDeliveryTimeOfOrder1;
      }
      console.log(formatDateToString(sequenceObject.maxTime));
      sequenceObjectList.push(sequenceObject);
    }
    console.log(sequenceObjectList);

    return sequenceObjectList;
  } catch (error) {
    console.log('Error getting sequence for one orders', error);
    throw new Error('Error getting sequence for one orders');
  }
}
