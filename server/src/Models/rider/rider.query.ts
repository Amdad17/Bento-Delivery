import { IRider } from '../../Interfaces/IRider';
import { IRiderDailyRecords } from '../../Interfaces/IRiderDailyRecords';
import { IRiderSignup } from '../../Interfaces/IRiderSignup';
import { createRiderDailyRecords } from '../riderDailyRecords/riderDailyRecords.query';

import { Rider } from './rider.model';

export const getAvailableRiders = async () => {
  try {
    return await Rider.find({ onlineStatus: true }).select('-password');
  } catch (error) {
    console.log('Error getting available riders', error);
    console.error('Error getting available riders', error);
  }
};

export const getAllRiders = async () => {
  try {
    return await Rider.find().select('-password');
  } catch (error) {
    console.log('Error getting all riders', error);
    console.error('Error getting all riders', error);
  }
};

export const getRiderById = async (_id: string) => {
  try {
    return await Rider.findById(_id).select('-password');
  } catch (error) {
    console.log('Error getting rider by id', error);
    console.error('Error getting rider by id', error);
  }
};

export const updateRider = async (_id: string, rider: Partial<IRider>) => {
  try {
    const updatedRider = await Rider.findByIdAndUpdate(_id, { $set: rider }, { new: true });
    return updatedRider;
  } catch (error) {
    console.log('Error updating rider', error);
    console.error('Error updating rider', error);
  }
};

export const deleteRider = async (_id: string) => {
  try {
    return await Rider.findByIdAndDelete(_id);
  } catch (error) {
    console.log('Error deleting rider', error);
    console.error('Error deleting rider', error);
  }
};

export async function registerNewRiderInDB(riderInfo: IRiderSignup) {
  try {
    const savedDataInDb = await Rider.create(riderInfo);
    const riderOId = savedDataInDb._id;
    const newRecord = (await createRiderDailyRecords({
      riderId: riderOId,
      averageOrdersOfToday: 0,
      totalOrdersOfToday: 0,
    })) as IRiderDailyRecords;
    return { savedDataInDb, newRecord };
  } catch (error) {
    console.log('Error registering new rider', error);
    console.error('Error registering new rider', error);
  }
}

export async function findRiderByEmail(email: string) {
  try {
    const rider = await Rider.findOne({ email });
    return rider;
  } catch (error) {
    console.log('Error finding rider by email', error);
    console.error('Error finding rider by email', error);
  }
}

export async function completeRiderTask(riderId: string) {
  try {
    const rider = await Rider.findById(riderId);
    if (rider) {
      // rider.currentOrderList = [];
      // rider.routeSequence = [];
      // rider.currentBagCapacity = '50 X 50 X 60';
      // rider.riderStates.state0.available = true;
      // rider.riderStates.state1.completed = false;
      // rider.riderStates.state2.completed = false;
      // rider.riderStates.state3.completed = false;
      // rider.riderStates.state4.completed = false;
      // rider.riderStates.state1.restaurant1 = null;
      // rider.riderStates.state2.restaurant2 = null;
      // rider.riderStates.state3.customer1 = null;
      // rider.riderStates.state4.customer2 = null;
      let count = 0;
      const sequenceLength = rider.routeSequence.length - 1;
      for (const route of rider.routeSequence) {
        const sequence = route.sequence;
        console.log(`length ${sequenceLength} count ${count}`);
        console.log(
          `restaurant1 ${sequence === 'restaurant1' && !rider.riderStates.state1.completed}`,
        );
        console.log(
          `restaurant2 ${sequence === 'restaurant2' && !rider.riderStates.state2.completed}`,
        );
        console.log(`customer1 ${sequence === 'customer1' && !rider.riderStates.state3.completed}`);
        console.log(`customer2 ${sequence === 'customer2' && !rider.riderStates.state4.completed}`);

        if (sequence === 'rider') {
          count++;
          continue;
        } else if (sequence === 'restaurant1' && !rider.riderStates.state1.completed) {
          rider.riderStates.state1.completed = true;
          console.log('restaurant1 was completed');
          break;
        } else if (sequence === 'restaurant2' && !rider.riderStates.state2.completed) {
          rider.riderStates.state2.completed = true;
          console.log('restaurant2 was completed');
          break;
        } else if (
          sequence === 'customer1' &&
          !rider.riderStates.state3.completed &&
          rider.riderStates.state1.completed
        ) {
          if (
            rider.routeSequence[sequenceLength].sequence === 'customer1' &&
            count === sequenceLength
          ) {
            rider.currentOrderList = [];
            rider.routeSequence = [];
            rider.currentBagCapacity = '50 X 50 X 60';
            rider.riderStates.state0.available = true;
            rider.riderStates.state1.completed = false;
            rider.riderStates.state2.completed = false;
            rider.riderStates.state3.completed = false;
            rider.riderStates.state4.completed = false;
            rider.riderStates.state1.restaurant1 = null;
            rider.riderStates.state2.restaurant2 = null;
            rider.riderStates.state3.customer1 = null;
            rider.riderStates.state4.customer2 = null;
            console.log('customer1 was completed');
          } else {
            rider.riderStates.state3.completed = true;
            console.log('customer1 was completed! done');
          }
          break;
        } else if (
          sequence === 'customer2' &&
          !rider.riderStates.state4.completed &&
          rider.riderStates.state2.completed
        ) {
          if (
            rider.routeSequence[sequenceLength].sequence === 'customer2' &&
            count === sequenceLength
          ) {
            rider.currentOrderList = [];
            rider.routeSequence = [];
            rider.currentBagCapacity = '50 X 50 X 60';
            rider.riderStates.state0.available = true;
            rider.riderStates.state1.completed = false;
            rider.riderStates.state2.completed = false;
            rider.riderStates.state3.completed = false;
            rider.riderStates.state4.completed = false;
            rider.riderStates.state1.restaurant1 = null;
            rider.riderStates.state2.restaurant2 = null;
            rider.riderStates.state3.customer1 = null;
            rider.riderStates.state4.customer2 = null;
            console.log('customer2 was completed');
          } else {
            rider.riderStates.state4.completed = true;
            console.log('customer2 was completed! done');
          }
          break;
        }
        count++;
      }
    }
    let updatedRider = null;
    if (rider) {
      updatedRider = await rider.save();
    }
    return updatedRider;
  } catch (error) {
    console.log('Error completing Rider Task', error);
    console.error('Error completing Task', error);
  }
}
