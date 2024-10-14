import axios from 'axios'
import moment from 'moment';
import { Coupon, OrderContent, ReservationContent } from '~/types';
import { API_URL, SHOP } from '@env'
const baseUrl = API_URL
const shop = SHOP

const listCartItems = async (token: string) => {
  const options = {
    method: "get",
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/cartItem`,
    params: {
      shop: shop,
    },
  };
  let res = await axios(options).then((res) => {
    return res.data
  })
  return res
}

const countCartitem = async (token: string) => {
  const options = {
    method: "get",
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/cartItem/count`,
  };

  let res: number = await axios(options).then((res) => { return res.data })
  return res
}

const reservationCreateCart = async (token: string, id: string, reservationContent: ReservationContent) => {
  const options = {
    method: "post",
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/reservation/${id}/cart`,
    data: {
      reservationContent,
      shop,
    }
  }
  return await axios(options)
}

const productCreateCart = async (token: string, id: string, orderContent: OrderContent) => {
  const options = {
    method: "post",
    headers: {
      Authorization: `JWT ${token}`,
    },
    data: {
      orderContent,
      shop,
    },
    url: `${baseUrl}/product/${id}/cart`,
  }
  return await axios(options)
}

export {
  listCartItems,
  countCartitem,
  reservationCreateCart,
  productCreateCart
}
