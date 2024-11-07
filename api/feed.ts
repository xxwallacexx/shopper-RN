import axios from 'axios';
import { API_URL, SHOP } from '@env';
import { Feed, FeedComment } from '~/types';
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

const getFeed = async (id: string) => {
  const options = {
    method: 'get',
    url: `${baseUrl}/feed/${id}`,
  };
  let res: Feed = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const listFeedComments = async (id: string, skip: number) => {
  const options = {
    method: 'get',
    params: {
      skip,
      limit: 10,
    },
    url: `${baseUrl}/feed/${id}/comment`,
  };
  let res: FeedComment[] = await axios(options).then((res) => {
    return res.data.feedComments;
  });
  return res;
};

const getFeedLike = async (token: string, id: string) => {
  const options = {
    method: 'get',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/feed/${id}/like`,
  };

  let res: boolean = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const createFeedLike = async (token: string, id: string) => {
  const options = {
    method: 'post',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/feed/${id}/like`,
  };

  return await axios(options);
};

const removeFeedLike = async (token: string, id: string) => {
  const options = {
    method: 'delete',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/feed/${id}/like`,
  };

  return await axios(options);
};

const createFeedComment = async (token: string, id: string, formData: FormData) => {
  const options = {
    method: 'post',
    headers: {
      Authorization: `JWT ${token}`,
    },
    data: formData,
    url: `${baseUrl}/feed/${id}/comment`,
  };
  return await axios(options);
};

export {
  listFeeds,
  getFeed,
  listFeedComments,
  getFeedLike,
  createFeedLike,
  removeFeedLike,
  createFeedComment,
};
