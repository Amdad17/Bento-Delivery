import { ICustomer, ICustomerSignup } from '../../interfaces/ICustomer';

import Customer from './customer.model';

export async function registerNewCustomer(customer: ICustomerSignup) {
  try {
    const newCustomer = await Customer.create(customer);
    return { newCustomer };
  } catch (error) {
    console.error('Error registering new customer', error);
  }
}

export async function findCustomerByEmail(email: string) {
  try {
    const customer = await Customer.findOne({ email });
    return customer;
  } catch (error) {
    console.error('Error finding customer by email', error);
  }
}

export const getAllCustomers = async () => {
  try {
    return await Customer.find().select('-password');
  } catch (error) {
    console.error('Error getting all customer', error);
  }
};

export const getCustomerById = async (_id: string) => {
  try {
    return await Customer.findById(_id).select('-password');
  } catch (error) {
    console.error('Error getting customer by id', error);
  }
};

export const updateCustomer = async (_id: string, customer: ICustomer) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(_id, customer, { new: true });
    return updatedCustomer;
  } catch (error) {
    console.error('Error updating customer', error);
  }
};

export const deleteCustomer = async (_id: string) => {
  try {
    return await Customer.findByIdAndDelete(_id);
  } catch (error) {
    console.error('Error deleting customer', error);
  }
};
