import axios from 'axios'
import moment from 'moment';
import { Coupon } from '~/types';
import { API_URL, SHOP } from '@env'
const baseUrl = API_URL
const shop = SHOP

const listCoupons = async (token: string, skip: number, sort: string, productId?: string) => {
  const options = {
    method: "get",
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/coupon`,
    params: {
      shop: shop,
      skip: skip,
      endDateMin: moment().valueOf(),
      productId: productId,
      limit: 10,
      sort: sort,
    },
  };
  let res: Coupon[] = await axios(options).then((res) => { return res.data.coupons })
  return res
}

const getCoupon = async (token: string, couponId: string) => {
  const options = {
    method: "get",
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/coupon/${couponId}`,
  };

  let res: Coupon = await axios(options).then((res) => { return res.data })
  return res
}

const createUserCoupon = async (token: string, couponId: string) => {
  const options = {
    method: "post",
    headers: {
      Authorization: `JWT ${token}`,
    },
    data: {
      couponId: couponId,
    },
    url: `${baseUrl}/userCoupon`,
  };
  return await axios(options);
}

export {
  listCoupons,
  getCoupon,
  createUserCoupon
}
