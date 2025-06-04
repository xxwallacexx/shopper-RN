import { API_URL, SHOP } from '@env';
import axios from 'axios';

import { Banner } from '~/types';
const baseUrl = API_URL;
const shop = SHOP;

const listAdsBanners = async () => {
  const options = {
    method: 'get',
    url: `${baseUrl}/adsBanner`,
    params: {
      shop,
      skip: 0,
      limit: 0,
      'status[]': 'ACTIVE',
    },
  };

  const res: Banner[] = await axios(options)
    .then((res) => {
      return res.data.adsBanners;
    })
    .catch((e) => {
      throw e;
    });

  return res;
};

export { listAdsBanners };
