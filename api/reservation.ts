import axios from 'axios';

import { API_URL, SHOP } from '@env';
import {
  Reservation,
  UserCoupon,
  ReservationContent,
  PaymentMethodEnum,
  Contact,
  Order,
} from '~/types';
const baseUrl = API_URL;
const shop = SHOP;

const listReservations = async (
  token: string,
  productId: string,
  timeMin: number,
  timeMax: number,
  skip: number
) => {
  const options = {
    method: 'get',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/reservation`,
    params: {
      productId: productId,
      skip: skip,
      timeMin: timeMin,
      timeMax: timeMax,
      limit: 0,
      'status[]': 'ACTIVE',
    },
  };
  let res: Reservation[] = await axios(options).then((res) => {
    return res.data.reservations;
  });
  return res;
};

const listReservationAvailableCoupons = async (
  token: string,
  id: string,
  reservationContent: ReservationContent
) => {
  const options = {
    method: 'put',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/reservation/${id}/availableCoupons`,
    data: {
      reservationContent,
    },
  };
  let res: UserCoupon[] = await axios(options)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      throw new Error(e.response.data.errorCodes);
    });
  return res;
};

const getReservationTotalPrice = async (
  token: string,
  id: string,
  reservationContent: ReservationContent,
  currentCouponId?: string
) => {
  const options = {
    method: 'put',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/reservation/${id}/totalPrice`,
    data: {
      reservationContent,
      currentCouponId,
    },
  };
  let res: number = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const getReservation = async (token: string, id: string) => {
  const options = {
    method: 'get',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/reservation/${id}`,
  };
  let res: Reservation = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const createReservationOrder = async (
  token: string,
  id: string,
  stripeTokenId: string,
  contact: Contact,
  reservationContent: ReservationContent,
  paymentMethod: keyof typeof PaymentMethodEnum,
  currentCouponId?: string
) => {
  const options = {
    method: 'post',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/reservation/${id}/order`,
    data: {
      currentCouponId,
      stripeTokenId,
      contact,
      shop,
      reservationContent,
      paymentMethod,
    },
  };
  let res: Order = await axios(options)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      throw new Error(e.response.data.errorCodes);
    });
  return res;
};
export {
  listReservations,
  listReservationAvailableCoupons,
  getReservationTotalPrice,
  getReservation,
  createReservationOrder,
};
