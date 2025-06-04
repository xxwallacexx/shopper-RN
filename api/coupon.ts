import { API_URL, SHOP } from '@env';
import axios from 'axios';
import moment from 'moment';

import { Coupon, UserCoupon } from '~/types';
const baseUrl = API_URL;
const shop = SHOP;

const listCoupons = async (token: string, skip: number, sort: string, productId?: string) => {
  const options = {
    method: 'get',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/coupon`,
    params: {
      shop,
      skip,
      endDateMin: moment().valueOf(),
      productId,
      limit: 10,
      sort,
    },
  };
  const res: Coupon[] = await axios(options).then((res) => {
    return res.data.coupons;
  });
  return res;
};

const getCoupon = async (token: string, couponId: string) => {
  const options = {
    method: 'get',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/coupon/${couponId}`,
  };

  const res: Coupon = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const createUserCoupon = async (token: string, couponId: string) => {
  const options = {
    method: 'post',
    headers: {
      Authorization: `JWT ${token}`,
    },
    data: {
      couponId,
    },
    url: `${baseUrl}/userCoupon`,
  };
  return await axios(options).catch((e) => {
    throw e.response.data.errorCodes[0];
  });
};

const listUserCoupon = async (token: string, skip: number) => {
  const options = {
    method: 'get',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/userCoupon`,
    params: {
      shop,
      limit: 10,
      skip,
    },
  };
  const res: UserCoupon[] = await axios(options).then((res) => {
    return res.data.userCoupons;
  });
  return res;
};

export { listCoupons, getCoupon, createUserCoupon, listUserCoupon };
