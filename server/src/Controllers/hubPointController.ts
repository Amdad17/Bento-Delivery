import { point, polygon, booleanPointInPolygon, featureCollection, centerOfMass } from '@turf/turf';
import axios from 'axios';
import { Request, Response } from 'express';

import { IHub } from '../Interfaces/IHub';
import { IRider } from '../Interfaces/IRider';
import { IUtilizationData } from '../Interfaces/IUtilizationData';
import {
  createAndAddAllHubs,
  deleteAllHubs,
  getAllHubs,
  getHubById,
  updateHubById,
} from '../Models/hub/hub.query';
import { getAllRiders, getRiderById, updateRider } from '../Models/rider/rider.query';
import {
  getAllOrderHistoryForLastOneMonthFromMarketplace,
  // getAllRidersForHub,
  getAllUtilizationDatas,
  // getRiderFromRiderServer,
} from '../services/external.service';

interface RiderTrack {
  [rider: string]: boolean;
}

export const getAllHubsInZone = async (req: Request, res: Response) => {
  try {
    const hubs: IHub[] = await getAllHubs();
    res.status(200).send(hubs);
  } catch (error) {
    console.error('Error getting all hubs', error);
    throw error;
  }
};

export const assignRiderToHub = async (req: Request, res: Response) => {
  try {
    const riderId = req.params.id;
    const rider = (await getRiderById(riderId)) as IRider;
    // if (!rider.hubId) {
    const hubs: IHub[] = await getAllHubs();

    let selectedHub: IHub | null = null;
    // console.log('Hubs are: ', hubs.length);
    // console.log('Rider is: ', rider);
    // if (foundHubs) {
    if (hubs) {
      selectedHub = await getSuitableHubForRider(hubs, rider);
    }

    if (selectedHub) {
      selectedHub = await updateHubById(String(selectedHub?._id), selectedHub);
    }

    res.status(200).send({
      riderId: riderId,
      hubId: selectedHub?._id,
      center: selectedHub?.center,
    });

    // }
    // else res.status(304).send('Rider already has an existing hub');
  } catch (error) {
    console.error('Error assigning rider to hub:', error);
    throw error;
  }
};

export const removeRiderfromHub = async (req: Request, res: Response) => {
  try {
    const riderId: string = req.params.riderId;
    const hubId: string = req.params.hubId;

    let hub: IHub = await getHubById(hubId);
    if (hub) {
      let rider: IRider[] | null = null;
      console.log('Hub is: ', hub);

      const index = hub.riders.findIndex(riderItem => String(riderItem._id) === riderId);
      console.log('Index is: ', index);
      if (index !== -1) {
        rider = hub.riders.splice(index, 1);
        const data = {
          hubId: null,
          hubLatLong: {
            longitude: 0,
            latitude: 0,
          },
        };
        // rider[0].hubId = null;
        // rider[0].hubLatLong.longitude = 0;
        // rider[0].hubLatLong.latitude = 0;
        if (rider[0]._id) await updateRider(rider[0]._id, data);
      }

      //hub updated after removing rider
      hub = await updateHubById(hubId, hub);

      if (rider) {
        rider[0].hubId = null;
      }
      // rider[0]
      // if (rider) res.status(201).send(`Rider ID# ${rider[0]._id} removed from Hub ID# ${hubId}`);
      if (rider) res.status(201).send(rider[0]);
      else res.status(201).send('Rider not found');
    } else res.status(201).send('Hub not found');
  } catch (error) {
    console.error('Error removing rider from hub:', error);
    throw error;
  }
};

export const getAllHubsByCustomerLocation = async (req: Request, res: Response) => {
  try {
    const long = req.params.long;
    const lat = req.params.lat;

    const hubs: IHub[] = await getAllHubs();

    const polygonPoints: number[][][] = await getPolygon(
      parseFloat(long),
      parseFloat(lat),
      20,
      'driving-traffic',
    );

    const foundHubs: IHub[] = hubsInsidePolygon(hubs, polygonPoints);
    res.status(200).send(foundHubs);
  } catch (error) {
    console.error('Error fetching hubs for recommendation engine:', error);
    throw error;
  }
};

// export const updateAllHubs = async (req: Request, res: Response) => {
export const updateAllHubs = async () => {
  try {
    const utilizationData = await getAllUtilizationDatas();
    const orderHistoryData = await getAllOrderHistoryForLastOneMonthFromMarketplace();
    //TODO: Type Definition is NOT CORRECT. Need Fixing
    // const riderArr = (await getAllRidersForHub()) as ModRider2[];
    const riderArr = (await getAllRiders()) as ModRider2[];

    console.log('All data fetched');

    const ridersCount: number = riderArr.length;

    const hubsRestauratArr: IUtilizationData[][] = [];
    const visited = new Map<string, boolean>();

    for (const data of utilizationData) {
      const key = `${data.restaurantLongitude},${data.restaurantLatitude},${data.restaurantId}`;
      if (!visited.get(key)) {
        const singleHub = await calculateSingleHubPolygon(data, utilizationData, visited);
        hubsRestauratArr.push(singleHub);
      }
    }

    const hubCenters = calculateHubCenter(hubsRestauratArr);

    const hubArr: IHub[] = [];
    const orderCount = new Map<string, number>();
    for (const data of orderHistoryData) {
      const key = `${data.restaurantId}`;
      let value = orderCount.get(key);
      if (value === undefined) {
        orderCount.set(key, 1);
      } else {
        orderCount.set(key, ++value);
      }
    }

    for (let i = 0; i < hubsRestauratArr.length; i++) {
      let counter = 0;
      for (let j = 0; j < hubsRestauratArr[i].length; j++) {
        const key = `${hubsRestauratArr[i][j].restaurantId}`;
        const value = orderCount.get(key);
        if (value) {
          counter += value;
        }
      }

      counter = 1; //DELETE When Order History Data is ready

      //sort restaurants in hub in ascending order of utilization rate
      hubsRestauratArr[i] = hubsRestauratArr[i].sort((a, b) => a.utilization - b.utilization);

      //setting hub status, by averaging the utilization of all restaurants in hub
      const currentHubUtilTotal: number = hubsRestauratArr[i].reduce((acc, current) => {
        return acc + current.utilization;
      }, 0);
      const hubStatusValue: number = currentHubUtilTotal / hubsRestauratArr[i].length;

      const newHub = {
        // capacity: Math.round((counter / orderHistoryData.length) * ridersCount),
        capacity: Math.round((counter / hubsRestauratArr.length) * ridersCount), //PROBLEM AREA. FIX LATER
        riders: [],
        restaurants: hubsRestauratArr[i],
        center: hubCenters[i],
        status:
          hubStatusValue > 75 ? 'HU' : hubStatusValue > 50 && hubStatusValue <= 75 ? 'MU' : 'LU',
      };

      hubArr.push(newHub);
    }

    const riderTrack: RiderTrack = {};
    let finalHubs: IHub[] = [];
    // eslint-disable-next-line
    finalHubs = await assignRidersToHub(riderArr, hubArr, riderTrack);

    await deleteAllHubs();
    finalHubs = await createAndAddAllHubs(finalHubs);

    console.log('All Hubs Updated');
    // res.status(201).json(finalHubs);
    return finalHubs;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

async function getSuitableHubForRider(hubs: IHub[], rider: IRider) {
  try {
    interface HubTimeData {
      hubId: string;
      time: number;
      hub: IHub;
    }

    const hubsTimeArr: HubTimeData[] = [];

    const mapboxMaxDivider = 24;
    let divide = Math.ceil(hubs.length / mapboxMaxDivider);
    let coordsArr = [];
    let coordsStr = '';

    let z = 0;
    while (divide > 0) {
      coordsArr.push(`${rider.currentLatLong.longitude},${rider.currentLatLong.latitude}`);
      for (let i = z * 24, j = 0; j < 24 && i < hubs.length; i++, j++) {
        coordsArr.push(`${hubs[i].center[0]},${hubs[i].center[1]}`);
      }

      coordsStr = coordsArr.join(';');

      interface Location {
        distance: number;
        name: string;
        location: [number, number];
      }

      interface Response {
        data: {
          code: string;
          destinations: Location[];
          durations: number[][];
          sources: Location[];
        };
      }

      const response: Response = await axios.get(
        `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordsStr}?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
      );

      for (let k = z * 24, i = 0; i < 24 && k < hubs.length; k++, i++) {
        hubsTimeArr.push({
          hubId: String(hubs[k]._id),
          time: response.data.durations[0][k - z * 24 + 1],
          hub: hubs[k],
        });
      }

      divide--;
      z++;
      coordsArr = [];
    }
    hubsTimeArr.sort((a, b) => a.time - b.time);

    let selectedHub: IHub | null = null;
    let hubFound = false;
    for (let k = 0; k < hubsTimeArr.length; k++) {
      if (hubsTimeArr[k].hub.capacity > hubsTimeArr[k].hub.riders.length) {
        selectedHub = hubsTimeArr[k].hub;
        rider.hubId = String(selectedHub._id);
        if (rider.hubLatLong) {
          rider.hubLatLong.longitude = selectedHub.center[0];
          rider.hubLatLong.latitude = selectedHub.center[1];
        }
        selectedHub.riders.push(rider);
        hubFound = true;
        break;
      }
    }
    if (!hubFound) {
      selectedHub = hubsTimeArr[0].hub;
      rider.hubId = String(selectedHub._id);
      if (rider.hubLatLong) {
        rider.hubLatLong.longitude = selectedHub.center[0];
        rider.hubLatLong.latitude = selectedHub.center[1];
      }
      selectedHub.riders.push(rider);
    }

    if (rider._id) await updateRider(rider._id, rider);

    return selectedHub;
  } catch (error) {
    console.error('Error selecting hub for rider:', error);
    throw error;
  }
}

function calculateHubCenter(hubs: IUtilizationData[][]) {
  const centers: number[][] = [];

  for (let i = 0; i < hubs.length; i++) {
    const LUMUarr: IUtilizationData[] = [];
    const HUarr: IUtilizationData[] = [];

    for (let j = 0; j < hubs[i].length; j++) {
      if (hubs[i][j].level !== 'HU') {
        LUMUarr.push(hubs[i][j]);
      } else {
        HUarr.push(hubs[i][j]);
      }
    }

    if (LUMUarr.length > 0) {
      const coordinates = LUMUarr.map(restaurant => {
        return [restaurant.restaurantLongitude, restaurant.restaurantLatitude];
      });

      const pointFeatures = coordinates.map(pointCoords => point(pointCoords));
      const pointCollection = featureCollection(pointFeatures);
      const center = centerOfMass(pointCollection);
      const centerCoords = center.geometry.coordinates;
      centers.push(centerCoords);
    } else {
      const coordinates = HUarr.map(restaurant => {
        return [restaurant.restaurantLongitude, restaurant.restaurantLatitude];
      });

      const pointFeatures = coordinates.map(pointCoords => point(pointCoords));
      const pointCollection = featureCollection(pointFeatures);
      const center = centerOfMass(pointCollection);
      const centerCoords = center.geometry.coordinates;
      centers.push(centerCoords);
    }
  }

  return centers;
}

async function getPolygon(lon: number, lat: number, time: number, type: string) {
  try {
    // eslint-disable-next-line
    const response: any = await axios.get(
      `https://api.mapbox.com/isochrone/v1/mapbox/${type}/${lon},${lat}?contours_minutes=${time}&contours_colors=6706ce&polygons=true&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
    );
    // eslint-disable-next-line
    return response.data.features[0].geometry.coordinates as number[][][];
  } catch (error) {
    console.error('Error fetching polygon data:', error);
    throw error;
  }
}

function hubsInsidePolygon(hubs: IHub[], polygonPoints: number[][][]) {
  const newArr: IHub[] = [];

  const polygonFeature = polygon(polygonPoints);

  for (const hub of hubs) {
    const pointFeature = point([hub.center[0], hub.center[1]]);
    if (booleanPointInPolygon(pointFeature, polygonFeature)) {
      newArr.push(hub);
    }
  }

  return newArr;
}

function restaurantsInsideHub(restaurants: IUtilizationData[], polygonPoints: number[][][]) {
  const newArr: IUtilizationData[] = [];

  const polygonFeature = polygon(polygonPoints);

  for (const restaurant of restaurants) {
    const pointFeature = point([restaurant.restaurantLongitude, restaurant.restaurantLatitude]);
    if (booleanPointInPolygon(pointFeature, polygonFeature)) {
      newArr.push(restaurant);
    }
  }

  return newArr;
}

async function calculateSingleHubPolygon(
  src: IUtilizationData,
  restaurants: IUtilizationData[],
  visited: Map<string, boolean>,
) {
  const singleHub: IUtilizationData[] = [];
  visited.set(`${src.restaurantLongitude},${src.restaurantLatitude},${src.restaurantId}`, true);
  singleHub.push(src);
  const polygonPoints: number[][][] = await getPolygon(
    src.restaurantLongitude,
    src.restaurantLatitude,
    10,
    'driving-traffic',
  );
  const restaurantsInsidePolygon: IUtilizationData[] = restaurantsInsideHub(
    restaurants,
    polygonPoints,
  );

  for (const restaurant of restaurantsInsidePolygon) {
    const key = `${restaurant.restaurantLongitude},${restaurant.restaurantLatitude},${restaurant.restaurantId}`;
    if (!visited.get(key)) {
      visited.set(key, true);
      singleHub.push(restaurant);
    }
  }

  return singleHub;
}
type ModRider = Omit<IRider, '_id'>;
type ModRider2 = ModRider & { _id: string };

//TODO: Type Definition is NOT CORRECT. Need Fixing
async function assignRidersToHub(riders: ModRider2[], hubs: IHub[], riderTrack: RiderTrack) {
  for (let i = 0; i < riders.length; i++) {
    if (riders[i].onlineStatus === true && riders[i].currentOrderList.length === 0) {
      riderTrack[riders[i]._id] = true;
    } else {
      riderTrack[riders[i]._id] = false;
    }
  }

  interface HubTimeData {
    riderId: string;
    time: number;
    rider: IRider;
  }

  type HubsTimeArr = HubTimeData[][];

  const hubsTimeArr: HubsTimeArr = [];

  let count = 0;

  for (let x = 0; x < hubs.length; x++) {
    let divide = Math.ceil(riders.length / 24);
    let coordsArr = [];
    let coordsStr = '';

    const hubTimes: HubTimeData[] = [];
    let z = 0;
    // console.log(divide);
    while (divide > 0) {
      coordsArr.push(`${hubs[x].center[0]},${hubs[x].center[1]}`);
      for (let i = z * 24, j = 0; j < 24 && i < riders.length; i++, j++) {
        coordsArr.push(
          `${riders[i].currentLatLong.longitude},${riders[i].currentLatLong.latitude}`,
        );
      }

      coordsStr = coordsArr.join(';');

      interface Location {
        distance: number;
        name: string;
        location: [number, number];
      }

      interface Response {
        data: {
          code: string;
          destinations: Location[];
          durations: number[][];
          sources: Location[];
        };
      }
      const response: Response = await axios.get(
        `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordsStr}?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
      );

      for (let k = z * 24, i = 0; i < 24 && k < riders.length; k++, i++) {
        hubTimes.push({
          riderId: riders[k]._id,
          time: response.data.durations[0][k - z * 24 + 1],
          rider: riders[k],
        });
      }

      count++;
      divide--;
      z++;
      coordsArr = [];
    }
    hubTimes.sort((a, b) => a.time - b.time);
    hubsTimeArr.push(hubTimes);
    if (count === 50) {
      console.log(
        'WARNING!! Hub and Rider Allocation in progress. Your Patience is highly APPRECIATED. Currennty at Hub: ',
        x + 1,
      );
      await new Promise(resolve => setTimeout(resolve, 62000));
      count = 0;
    }
  }

  let riderCnt = 0;

  for (const key in riderTrack) {
    // eslint-disable-next-line
    if (riderTrack.hasOwnProperty(key)) {
      if (riderTrack[key] === true) riderCnt++;
    }
  }

  while (riderCnt) {
    for (let i = 0; i < hubs.length; i++) {
      if (hubs[i].capacity > hubs[i].riders.length) {
        for (let j = 0; j < hubsTimeArr[i].length; j++) {
          let ok = false;
          if (riderTrack[hubsTimeArr[i][j].riderId] === true) {
            // hubsTimeArr[i][j].rider.hubId = String(hubs[i]._id);
            hubs[i].riders.push(hubsTimeArr[i][j].rider);

            riderTrack[hubsTimeArr[i][j].riderId] = false;
            riderCnt--;
            ok = true;
          }
          if (ok) {
            break;
          }
        }
      }
    }
  }

  return hubs;
}
