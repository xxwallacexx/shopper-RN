import { API_URL, SHOP } from '@env';
import axios from 'axios';

import { Order } from '~/types';
const baseUrl = API_URL;
const shop = SHOP;

const listOrders = async (token: string, skip: number) => {
  const options = {
    method: 'get',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/order`,
    params: {
      shop,
      skip,
      limit: 10,
    },
  };
  const res: Order[] = await axios(options).then((res) => {
    return res.data.orders;
  });
  return res;
};

const getOrder = async (token: string, id: string) => {
  const options = {
    method: 'get',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/order/${id}`,
  };
  const res: Order = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

export { listOrders, getOrder };
