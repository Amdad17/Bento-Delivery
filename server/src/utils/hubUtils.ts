import { updateAllHubs } from '../Controllers/hubPointController';
import { updateRider } from '../Models/rider/rider.query';

export const updateAllRiders = async () => {
  const hubs = await updateAllHubs();
  for (const hub of hubs) {
    for (const rider of hub.riders) {
      rider.hubId = String(hub._id);
      rider.hubLatLong = {
        longitude: hub.center[0],
        latitude: hub.center[1],
      };
      if (rider._id) {
        await updateRider(rider._id, rider);
      }
    }
  }
};
