import amqp, { Channel, Connection } from 'amqplib';

import { io } from '..';
import { IOrder } from '../interfaces/IOrder';
import { assignRiderToOrder, createOrder } from '../models/order/order.query';

const queue = 'marketplaceToRider';
let connection: Connection;
let channel: Channel;

export async function connectAnConsumeMarketplaceOrderDataFromMQ() {
  try {
    const amqpServer = process.env.AMQP_URL as string;
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: false });
    // eslint-disable-next-line
    channel.consume(
      queue,
      async data => {
        if (data) {
          let isProcessingOrder = false;
          const newOrder = JSON.parse(data.content.toString()) as IOrder;

          console.log('new order has come', newOrder);
          // Check if an order is already being processed
          if (!isProcessingOrder) {
            isProcessingOrder = true;
            const updatedOrder = await assignRiderToOrder(newOrder);
            if (updatedOrder) {
              const riderSideOrder = await createOrder(updatedOrder);
              console.log('riderSideOrder', riderSideOrder);
            }
            // Emit the 'riderFound' event
            io.emit('riderFound', updatedOrder);
            console.log('isProcessing', isProcessingOrder);
            // Reset the processing flag after a delay (e.g., 1 minute)
            setTimeout(() => {
              isProcessingOrder = false;
            }, 3000); // 60000 milliseconds = 1 minute
          }
        }
      },
      { noAck: true },
    );
  } catch (error) {
    console.log(error);
  }
}

// Function to close rabbitmq Connection and channel
export async function closeMQConnection() {
  try {
    if (connection) await connection.close();
    if (channel) await channel.close();
  } catch (error) {
    console.log(error);
  }
}
