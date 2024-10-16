import axios from 'axios'
import moment from 'moment';
import { CartItem, Coupon, OrderContent, ReservationContent } from '~/types';
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
  let res: CartItem[] = await axios(options).then((res) => {
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

const cartItemGetTotalPrice = async (token: string, currentCouponIds: string[], deliveryMethod?: string) => {
  const options = {
    method: "get",
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/cartItem/totalPrice`,
    params: {
      shop,
      currentCouponIds,
      deliveryMethod,
    }
  };
  let res: number = await axios(options).then((res) => { return res.data })

  return res
}

const cartItemGetPriceDetail = async (token: string, currentCouponIds: string[], deliveryMethod?: string) => {
  const options = {
    method: "get",
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/cartItem/priceDetail`,
    params: {
      shop,
      currentCouponIds,
      deliveryMethod,
    },
  };
  return await axios(options).then((res) => { return res.data });
}

const updateCartItem = async (token: string, id: string, orderContent: OrderContent) => {
  const options = {
    method: "put",
    headers: {
      Authorization: `JWT ${token}`,
    },
    data: {
      orderContent: orderContent,
    },
    url: `${baseUrl}/cartItem/${id}`,
  };
  return axios(options);
}

const removeCartItem = async (token: string, id: string) => {
  const options = {
    method: "delete",
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/cartItem/${id}`,
  };
  return axios(options);
}
export {
  listCartItems,
  countCartitem,
  reservationCreateCart,
  productCreateCart,
  cartItemGetTotalPrice,
  cartItemGetPriceDetail,
  updateCartItem,
  removeCartItem
}
