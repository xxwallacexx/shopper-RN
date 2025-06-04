import { API_URL } from '@env';
import axios from 'axios';

import { ProductComment } from '~/types';
const baseUrl = API_URL;

const getProductComment = async (id: string) => {
  const options = {
    method: 'get',
    url: `${baseUrl}/productComment/${id}`,
  };
  const res: ProductComment = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const editProductComment = async (token: string, id: string, formData: FormData) => {
  const options = {
    method: 'put',
    headers: {
      Authorization: `JWT ${token}`,
    },
    data: formData,
    url: `${baseUrl}/productComment/${id}`,
  };
  return await axios(options)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      throw new Error(e.response.data.errorCodes);
    });
};

const removeProductComment = async (token: string, id: string) => {
  const options = {
    method: 'delete',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/productComment/${id}`,
  };
  return await axios(options)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      throw new Error(e.response.data.errorCodes);
    });
};

export { getProductComment, editProductComment, removeProductComment };
