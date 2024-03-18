import fs from 'fs';
import { promisify } from 'util';

import { IOrderHistory } from '../interfaces/IOrderHistory';

const orderDataFilePath = 'src/jsons/order-history-data.json';

const readFileAsync = promisify(fs.readFile);

export async function getAllOrderHistoryForLastOneMonthFromMarketplace() {
  try {
    const data = await readFileAsync(orderDataFilePath, 'utf8');
    const jsonData = JSON.parse(data) as IOrderHistory[];

    return jsonData;
    // const res = await axios.get('order-history-one-month-route');
    // return res.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting Order Hsitory data from Marketplace');
  }
}
