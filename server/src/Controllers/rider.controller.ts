import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

//eslint-disable-next-line
import { io } from '..';
import config from '../config';
import { ILogin } from '../interfaces/ILogin';
import { IRider } from '../interfaces/IRider';
import { IRiderSignup } from '../interfaces/IRiderSignup';
import {
  findRiderByEmail,
  registerNewRiderInDB,
  getAvailableRiders,
  updateRider,
  deleteRider,
  getRiderById,
  getAllRiders,
  completeRiderTask,
  makeAllRidersOffline,
  makeAllRidersOnline,
} from '../models/rider/rider.query';
import { deleteRiderDailyRecords } from '../models/riderDailyRecords/riderDailyRecords.query';

export async function riderSignup(req: Request, res: Response) {
  try {
    const signUpInfo = req.body as IRiderSignup;
    const existedRider = await findRiderByEmail(signUpInfo.email);
    if (existedRider) {
      return res.status(400).json({ message: 'Rider already exists' });
    }

    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(signUpInfo.password, salt);
    signUpInfo.password = hashedPassword;

    const signupResult = await registerNewRiderInDB(signUpInfo);
    res.status(201).json({ message: 'Rider Created', data: signupResult });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: (error as Error).message });
  }
}

export async function riderLogin(req: Request, res: Response) {
  try {
    const loginInfo = req.body as ILogin;
    const riderInfo = (await findRiderByEmail(loginInfo.email)) as IRider;
    const hashedPassFromDB = riderInfo.password;
    const isPasswordMatch = await bcrypt.compare(loginInfo.password, hashedPassFromDB);
    if (isPasswordMatch) {
      const token = createJwtToken(riderInfo);
      res.setHeader('authorization', `Bearer ${token}`);
      res.status(200).json({ riderInfo });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: (error as Error).message });
  }
}

function createJwtToken(riderInfo: IRider): string {
  const { _id, name, phoneNumber, email, vehicleType } = riderInfo;
  return jwt.sign({ _id, name, phoneNumber, email, vehicleType }, config.JWT_SECRET, {
    expiresIn: '7d',
  });
}

export async function findAllAvailableRider(req: Request, res: Response) {
  try {
    const availableRiders = await getAvailableRiders();
    res.status(200).json({ availableRiders });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: (error as Error).message });
  }
}

export async function editRider(req: Request, res: Response) {
  try {
    const riderId = req.params.id;
    const riderInfo = req.body as IRider;
    const updatedRider = await updateRider(riderId, riderInfo);
    res.status(200).json({ updatedRider });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: (error as Error).message });
  }
}

export async function removeRider(req: Request, res: Response) {
  try {
    const riderId = req.params.id;
    const deletedRider = await deleteRider(riderId);
    await deleteRiderDailyRecords(riderId);
    res.status(200).json({ deletedRider });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: (error as Error).message });
  }
}

export async function findRiderById(req: Request, res: Response) {
  try {
    const riderId = req.params.id;
    const rider = await getRiderById(riderId);
    // io.emit('riderFound', rider);
    res.status(200).json({ rider });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: (error as Error).message });
  }
}

export async function findAllRiders(req: Request, res: Response) {
  try {
    const riders = await getAllRiders();
    res.status(200).json({ riders });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: (error as Error).message });
  }
}

export async function markRiderTaskAsDone(req: Request, res: Response) {
  try {
    const riderId = req.params.id;
    const rider = await completeRiderTask(riderId);
    res.status(200).json({ rider });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: (error as Error).message });
  }
}

export async function makeAllRidersOfflineController(req: Request, res: Response) {
  try {
    const result = await makeAllRidersOffline();
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: (error as Error).message });
  }
}

export async function makeAllRidersOnlineController(req: Request, res: Response) {
  try {
    const result = await makeAllRidersOnline();
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: (error as Error).message });
  }
}
