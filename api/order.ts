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
      shop: shop,
      skip: skip,
      limit: 10,
    },
  };
  let res: Order[] = await axios(options).then((res) => {
    return res.data.orders;
  });
  console.log(res);
  return res;
};

export { listOrders };
