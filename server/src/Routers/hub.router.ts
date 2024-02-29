import express from 'express';

import {
  // updateAllHubs,
  assignRiderToHub,
  removeRiderfromHub,
  getAllHubsInZone,
  getAllHubsByCustomerLocation,
} from '../Controllers/hubPointController';
// import { utilizationDataController } from '../Controllers/utilizationData.controller';

const router = express.Router();

// router.get('/utilization-data', utilizationDataController);
// router.get('/hub-point', updateAllHubsAndReturnRiderData);
// router.get('/update-hubs', updateAllHubs);

router.post('/assign-rider/:id', assignRiderToHub);
router.put('/remove-rider/hub/:hubId/rider/:riderId', removeRiderfromHub);
router.get('/get-all-hubs', getAllHubsInZone);
router.get('/get-hubs-for-customer/longitude/:long/latitude/:lat', getAllHubsByCustomerLocation);

export default router;
