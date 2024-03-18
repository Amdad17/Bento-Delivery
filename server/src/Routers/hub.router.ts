import express from 'express';

import {
  assignRiderToHub,
  removeRiderfromHub,
  getAllHubsInZone,
  getAllHubsByCustomerLocation,
} from '../controllers/hubPointController';

const router = express.Router();

router.post('/assign-rider/:id', assignRiderToHub);
router.put('/remove-rider/hub/:hubId/rider/:riderId', removeRiderfromHub);
router.get('/get-all-hubs', getAllHubsInZone);
router.get('/get-hubs-for-customer/longitude/:long/latitude/:lat', getAllHubsByCustomerLocation);

export default router;
