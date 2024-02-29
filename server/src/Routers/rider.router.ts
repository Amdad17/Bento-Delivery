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
} from '../Controllers/rider.controller';
const riderRouter = express.Router();

riderRouter.post('/signup', riderSignup);
riderRouter.post('/login', riderLogin);
riderRouter.get('/availableRiders', findAllAvailableRider);
riderRouter.put('/editRider/:id', editRider);
riderRouter.delete('/deleteRider/:id', removeRider);
riderRouter.get('/findRider/:id', findRiderById);
riderRouter.get('/all', findAllRiders);

riderRouter.put('/completeTask/:id', markRiderTaskAsDone);

export default riderRouter;
