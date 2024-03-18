import { Types } from 'mongoose';

import { IHub } from '../../interfaces/IHub';

import Hub from './hub.model';

const getAllHubs = async () => {
  try {
    const hubs = await Hub.find();
    return hubs;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

const getHubById = async (id: string | Types.ObjectId) => {
  try {
    const hub: IHub = (await Hub.findById(id)) as IHub;
    return hub;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

const createAndAddAllHubs = async (hubsArray: IHub[]) => {
  try {
    const hubs = await Hub.insertMany(hubsArray);
    return hubs;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

const updateHubById = async (id: string, hubObject: Partial<IHub>) => {
  try {
    const hub = (await Hub.findByIdAndUpdate(
      id,
      {
        $set: { ...hubObject },
      },
      { new: true },
    )) as IHub;
    return hub;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

const deleteAllHubs = async () => {
  try {
    const hubs = await Hub.deleteMany();
    return hubs;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export { getAllHubs, getHubById, createAndAddAllHubs, updateHubById, deleteAllHubs };
