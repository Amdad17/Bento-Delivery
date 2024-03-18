import express from 'express';

import {
  riderLogin,
  riderSignup,
  findAllAvailableRider,
  editRider,
  removeRider,
  findRiderById,
  findAllRiders,
  markRiderTaskAsDone,
  makeAllRidersOfflineController,
  makeAllRidersOnlineController,
} from '../controllers/rider.controller';
const riderRouter = express.Router();

riderRouter.post('/signup', riderSignup);
riderRouter.post('/login', riderLogin);
riderRouter.get('/availableRiders', findAllAvailableRider);
riderRouter.put('/editRider/:id', editRider);
riderRouter.delete('/deleteRider/:id', removeRider);
riderRouter.get('/findRider/:id', findRiderById);
riderRouter.get('/all', findAllRiders);

riderRouter.put('/completeTask/:id', markRiderTaskAsDone);
riderRouter.put('/makeAllRidersOffline', makeAllRidersOfflineController);
riderRouter.put('/makeAllRidersOnline', makeAllRidersOnlineController);

export default riderRouter;
