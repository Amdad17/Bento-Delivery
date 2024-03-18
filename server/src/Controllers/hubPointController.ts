import { Request, Response } from 'express';

import { IHub } from '../interfaces/IHub';
import { IRider } from '../interfaces/IRider';
import { getAllHubs, getHubById, updateHubById } from '../models/hub/hub.query';
import { getRiderById, updateRider } from '../models/rider/rider.query';
import { getPolygon, getSuitableHubForRider, hubsInsidePolygon } from '../utils/hubUtils';

/*
  Function to get all hubs
*/
export const getAllHubsInZone = async (req: Request, res: Response) => {
  try {
    const hubs: IHub[] = await getAllHubs();
    res.status(200).send(hubs);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: (error as Error).message });
  }
};

/*
  Function to assign a Rider to a Hub based available capacity of hubs
*/
export const assignRiderToHub = async (req: Request, res: Response) => {
  try {
    const riderId = req.params.id;
    const rider = (await getRiderById(riderId)) as IRider;
    if (!rider.hubId && rider.hubLatLong.longitude === 0 && rider.hubLatLong.longitude === 0) {
      const hubs: IHub[] = await getAllHubs();

      let selectedHub: IHub | null = null;

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
    } else
      res.status(202).send('Rider already assigned to a HUB!! Unable to assign to another hub');
  } catch (error) {
    console.error('Error assigning rider to hub:', error);
    throw error;
  }
};

/*
  Function to remove rider from hub as per the given riderId and hubId
*/
export const removeRiderfromHub = async (req: Request, res: Response) => {
  try {
    const riderId: string = req.params.riderId;
    const hubId: string = req.params.hubId;

    let hub: IHub = await getHubById(hubId);

    if (hub) {
      let rider: IRider[] | null = null;
      let finalRiderObj: IRider | null = null;

      const index = hub.riders.findIndex(riderItem => String(riderItem._id) === riderId);
      if (index !== -1) {
        rider = hub.riders.splice(index, 1);
        const data = {
          hubId: null,
          hubLatLong: {
            longitude: 0,
            latitude: 0,
          },
        };
        if (rider[0]._id) finalRiderObj = (await updateRider(rider[0]._id, data)) as IRider;
      }

      hub = await updateHubById(hubId, hub);

      if (finalRiderObj) res.status(201).send(finalRiderObj);
      else res.status(201).send('Rider not found');
    } else res.status(201).send('Hub not found');
  } catch (error) {
    console.error('Error removing rider from hub:', error);
    throw error;
  }
};

/*
  Function to get all hubs by customer longitude and latitude, at a distance
  of 20 mins from location
*/
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
