import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import config from '../config';
import { IJwtRequest } from '../interfaces/IJwtRequest';

export function verifyJwtMiddleware(req: IJwtRequest, res: Response, next: NextFunction) {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) return res.status(401).json({ message: 'Unauthorized' });
  const token = authHeaders.split(' ')[1];
  const data = jwt.verify(token, config.JWT_SECRET) as {
    _id: string;
    name: string;
    phoneNumber: string;
    email: string;
    vehicleType: string;
  };

  if (data) {
    const user = {
      _id: data._id,
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email,
      vehicleType: data.vehicleType,
    };
    req.user = user;
    console.log('req.user', req.user);
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
