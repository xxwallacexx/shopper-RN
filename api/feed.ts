import axios from 'axios';
import { API_URL, SHOP } from '@env';
import { Feed } from '~/types';
const baseUrl = API_URL;
const shop = SHOP;

const listFeeds = async (skip: number) => {
  const options = {
    method: 'get',
    url: `${baseUrl}/feed`,
    params: {
      shop,
      skip,
      limit: 10,
      'status[]': 'ACTIVE',
    },
  };
  let res: Feed[] = await axios(options).then((res) => {
    return res.data.feeds;
  });
  return res;
};

export { listFeeds };
