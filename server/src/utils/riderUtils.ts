import { point, polygon, booleanPointInPolygon, Position } from '@turf/turf';

import { IRider } from '../interfaces/IRider';
import { IRiderDailyRecords } from '../interfaces/IRiderDailyRecords';
import {
  getRiderDailyRecordsByRiderId,
  resetAllRidersDailyRecords,
} from '../models/riderDailyRecords/riderDailyRecords.query';
import { getAllPotentialRidersOfIsochrone } from '../services/external-mapbox.service';

export const resetAllRidersDailyRecordsToDefault = async () => {
  console.log('Resetting starting');
  await resetAllRidersDailyRecords();
  console.log('Resetting completed');
};

export async function assignOneRiderFromOrder(long: number, lat: number, timeRange: number) {
  try {
    const potentialCycleRiders = await getAllPotentialRidersOfIsochrone(
      Number(lat),
      Number(long),
      'cycling',
      Number(timeRange),
    );

    const potentialBikeRiders = await getAllPotentialRidersOfIsochrone(
      Number(lat),
      Number(long),
      'driving',
      Number(timeRange),
    );

    let assignedRider = null;
    const assignedRiderRecords = null;

    if (potentialCycleRiders) {
      assignedRider = (await compareRiders(
        potentialCycleRiders,
        assignedRider,
        assignedRiderRecords,
      )) as IRider;
    }
    if (potentialBikeRiders) {
      assignedRider = (await compareRiders(
        potentialBikeRiders,
        assignedRider,
        assignedRiderRecords,
      )) as IRider;
    }

    if (assignedRider) {
      return assignedRider;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error assigning rider to order', error);
  }
}

// function to check if a point is inside a polygon
export function isPointInsidePolygon(
  polygonCoords: Position[][],
  lat: number,
  lon: number,
): boolean {
  const polygonFeature = polygon(polygonCoords);
  const pointFeature = point([lon, lat]);
  return booleanPointInPolygon(pointFeature, polygonFeature);
}

export function convertRidersToCoordinates(riders: IRider[]): string {
  return riders
    .map(rider => `${rider.currentLatLong.longitude},${rider.currentLatLong.latitude}`)
    .join(';');
}

export async function compareRiders(
  riders: IRider[],
  assignedRider: IRider | null,
  assignedRiderRecords: IRiderDailyRecords | null,
) {
  const maxRiderComparing = riders.length > 3 ? 3 : riders.length;

  for (let i = 0; i < maxRiderComparing; i++) {
    if (!assignedRider && !assignedRiderRecords) {
      assignedRider = riders[i];
      if (assignedRider) {
        assignedRiderRecords = await getRiderDailyRecordsByRiderId(assignedRider._id as string);
      }
    }
    const rider = riders[i];
    const riderDailyRecords = await getRiderDailyRecordsByRiderId(rider?._id as string);

    if (
      riderDailyRecords &&
      assignedRider &&
      assignedRiderRecords &&
      riderDailyRecords.totalOrdersOfToday &&
      assignedRiderRecords.totalOrdersOfToday
    ) {
      if (
        riderDailyRecords.totalOrdersOfToday / riderDailyRecords.averageOrdersOfToday <
        assignedRiderRecords.totalOrdersOfToday / assignedRiderRecords.averageOrdersOfToday
      ) {
        assignedRider = rider;
        assignedRiderRecords = riderDailyRecords;
      }
    }
  }

  return assignedRider;
}

export async function getAllPotentialRiders(
  lat: number,
  long: number,
  vehicle: string,
  timeRange: number,
) {
  try {
    const allPotentialRiders = await getAllPotentialRidersOfIsochrone(
      lat,
      long,
      vehicle,
      timeRange,
    );

    return allPotentialRiders;
  } catch (error) {
    console.error('Error getting all potential riders', error);
  }
}

export const searchRiderForOrder = async (
  restaurantLongitude: number,
  restaurantLatitude: number,
  min: number,
) => {
  try {
    let minutes = min;
    let findRiderForOrder = null;

    while (minutes < 60 && !findRiderForOrder) {
      findRiderForOrder = await assignOneRiderFromOrder(
        restaurantLongitude,
        restaurantLatitude,
        minutes,
      );
      minutes += 5;
      console.log('minutes', minutes);
    }

    return findRiderForOrder;
  } catch (error) {
    console.error('Error searching rider for order', error);
  }
};
