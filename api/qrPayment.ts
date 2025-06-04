import { API_URL, SHOP } from '@env';
import axios from 'axios';

import { PaymentMethodEnum, QRPayment } from '~/types';
const baseUrl = API_URL;
const shop = SHOP;

const createQRPayment = async (
  token: string,
  totalPrice: number,
  stripeTokenId: string,
  paymentMethod: keyof typeof PaymentMethodEnum
) => {
  const options = {
    method: 'post',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/shop/${shop}/QRPayment`,
    data: {
      totalPrice,
      stripeTokenId,
      shop,
      paymentMethod,
    },
  };
  return await axios(options)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      throw new Error(e.response.data.errorCodes);
    });
};

const listQRPayment = async (token: string, skip: number) => {
  const options = {
    method: 'get',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/shop/${shop}/QRPayment`,
    params: {
      limit: 10,
      skip,
    },
  };
  const res: QRPayment[] = await axios(options).then((res) => {
    return res.data.qrPayments;
  });
  return res;
};

export { createQRPayment, listQRPayment };
