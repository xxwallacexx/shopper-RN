import axios from 'axios';

import { API_URL, SHOP } from '@env';
import { PaymentMethodEnum } from '~/types';
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

export { createQRPayment };
