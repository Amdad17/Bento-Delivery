import express from 'express';

import {
  customerLogin,
  customerSignup,
  findAllCustomers,
  editCustomer,
  removeCustomer,
} from '../controllers/customer.controller';
const customerRouter = express.Router();

customerRouter.post('/signup', customerSignup);
customerRouter.post('/login', customerLogin);
customerRouter.get('/all', findAllCustomers);
customerRouter.put('/editcustomer/:id', editCustomer);
customerRouter.delete('/deletecustomer/:id', removeCustomer);

export default customerRouter;
