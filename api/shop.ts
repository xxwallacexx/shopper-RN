import { API_URL, SHOP } from '@env';
import axios from 'axios';

import { Shop } from '~/types';
const baseUrl = API_URL;
const shop = SHOP;

const getShop = async () => {
  const options = {
    method: 'get',
    url: `${baseUrl}/shop/${shop}`,
  };
  const res: Shop = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

export { getShop };
