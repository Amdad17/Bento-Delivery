import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import config from '../config';
import { ICustomer, ICustomerSignup } from '../interfaces/ICustomer';
import { ILogin } from '../interfaces/ILogin';
import {
  registerNewCustomer,
  findCustomerByEmail,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from '../models/customer/customer.query';

export async function customerSignup(req: Request, res: Response) {
  try {
    const signUpInfo = req.body as ICustomerSignup;
    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(signUpInfo.password, salt);
    signUpInfo.password = hashedPassword;

    const signupResult = await registerNewCustomer(signUpInfo);
    res.status(201).json({ message: 'Customer Created', data: signupResult });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: (error as Error).message });
  }
}

export async function customerLogin(req: Request, res: Response) {
  try {
    const loginInfo = req.body as ILogin;
    const customerInfo = (await findCustomerByEmail(loginInfo.email)) as ICustomer;
    const hashedPassFromDB = customerInfo.password;
    const isPasswordMatch = await bcrypt.compare(loginInfo.password, hashedPassFromDB);
    if (isPasswordMatch) {
      const token = createJwtToken(customerInfo);
      res.setHeader('authorization', `Bearer ${token}`);
      res.status(200).json({ customerInfo });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: (error as Error).message });
  }
}

function createJwtToken(customerInfo: ICustomer): string {
  const { _id, name, phoneNumber, email } = customerInfo;
  return jwt.sign({ _id, name, phoneNumber, email }, config.JWT_SECRET, {
    expiresIn: '7d',
  });
}

export async function findAllCustomers(req: Request, res: Response) {
  try {
    const customers = await getAllCustomers();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

export async function getCustomer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const customer = await getCustomerById(id);
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

export async function editCustomer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const customer = req.body as ICustomer;
    const updatedCustomer = await updateCustomer(id, customer);
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

export async function removeCustomer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deletedCustomer = await deleteCustomer(id);
    res.status(200).json(deletedCustomer);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}
