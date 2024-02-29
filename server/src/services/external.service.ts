import fs from 'fs';
import { promisify } from 'util';

import axios from 'axios';

import config from '../config';
// import { IRider } from '../Interfaces/IRider';
import { IUtilizationData } from '../Interfaces/IUtilizationData';
import { IOrderHistory } from '../Interfaces/orderHistory';

// const utilDataFilePath = 'src/jsons/utils-data.json';
// const kdsUtilDataFilePath = 'src/jsons/kds-utils-data.json';
const orderDataFilePath = 'src/jsons/order-history-data.json';
// const riderDataFilePath = 'src/jsons/riders-data.json';
// const singleRiderDataFilePath = 'src/jsons/one-rider-data.json';
const readFileAsync = promisify(fs.readFile);

export async function getAllUtilizationDatas() {
  try {
    const res = await axios.get(
      config.SKELETON_BE_BASE_URL + '/utilization/current/all/?delivery=true',
    );
    // eslint-disable-next-line
    return res.data.data as IUtilizationData[];
  } catch (error) {
    throw new Error('Error getting utilization datas from Skeleton.');
  }
}

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
