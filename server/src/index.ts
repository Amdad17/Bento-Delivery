import { createServer } from 'http';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import cron from 'node-cron';
import { Server } from 'socket.io';

import config from './config';
import customerRouter from './routers/customer.router';
import hubRouter from './routers/hub.router';
import orderRouter from './routers/order.router';
import riderRouter from './routers/rider.router';
import RiderDailyRecordsRouter from './routers/riderDailyRecords.router';
import {
  closeMQConnection,
  connectAnConsumeMarketplaceOrderDataFromMQ,
} from './services/orderFromMarketplaceMQ.service';
import { updateAllRiders } from './utils/hubUtils';
import { resetAllRidersDailyRecordsToDefault } from './utils/riderUtils';

const app: Express = express();
dotenv.config();
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    origin: '*',
    credentials: true,
    exposedHeaders: ['Authorization'],
  }),
);

app.use(express.json());

app.use('/hub', hubRouter);
app.use('/rider', riderRouter);
app.use('/customer', customerRouter);
app.use('/order', orderRouter);
app.use('/rider-daily-records', RiderDailyRecordsRouter);

cron.schedule('0 0 * * *', resetAllRidersDailyRecordsToDefault);

cron.schedule('* */23 * * *', async () => {
  await updateAllRiders();
});

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

io.on('connection', socket => {
  console.log('A user connected');
  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

async function main() {
  try {
    const uri = `mongodb+srv://${config.DB_USER}:${config.DB_PASS}@cluster0.ejwdabx.mongodb.net/bento-rider?retryWrites=true&w=majority`;

    await mongoose.connect(uri, {});
    console.log('Mongoose connected');

    httpServer.listen(config.PORT, () => {
      console.log(`[server]: Server is running on port ${config.PORT}`);
    });

    // Connecting to RabbitMQ from here
    await connectAnConsumeMarketplaceOrderDataFromMQ().catch(err => console.error(err));
    console.log('MQ Connected');

    // httpServer.listen(config.SOCKET_PORT, () => {
    //   console.log(`[socket]: Socket.IO is running on port ${config.SOCKET_PORT}`);
    // });
  } catch (err) {
    console.log(err);
  }
}

main().catch(err => console.error(err));

// Handle Server Shutdown . Close MQ Connection and Channel
process.on('SIGINT', async () => {
  console.log('Closing MQ Connection');
  await closeMQConnection();
  process.exit(0);
});
