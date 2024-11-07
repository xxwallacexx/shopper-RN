import axios from 'axios';
import { API_URL } from '@env';
import { FeedComment } from '~/types';
const baseUrl = API_URL;

const getFeedComment = async (id: string) => {
  const options = {
    method: 'get',
    url: `${baseUrl}/feedComment/${id}`,
  };
  let res: FeedComment = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const editFeedComment = async (token: string, id: string, formData: FormData) => {
  const options = {
    method: 'put',
    headers: {
      Authorization: `JWT ${token}`,
    },
    data: formData,
    url: `${baseUrl}/feedComment/${id}`,
  };
  return await axios(options)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      throw new Error(e.response.data.errorCodes);
    });
};

const removeFeedComment = async (token: string, id: string) => {
  const options = {
    method: 'delete',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/feedComment/${id}`,
  };
  return await axios(options)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      throw new Error(e.response.data.errorCodes);
    });
};

export { getFeedComment, editFeedComment, removeFeedComment };
