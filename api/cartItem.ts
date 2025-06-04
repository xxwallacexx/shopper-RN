import { API_URL, SHOP } from '@env';
import axios from 'axios';

import {
  AvailabelCoupon,
  CartItem,
  Contact,
  DeliveryMethodEnum,
  OrderContent,
  PaymentMethodEnum,
  PriceDetail,
  ReservationContent,
} from '~/types';
const baseUrl = API_URL;
const shop = SHOP;

const listCartItems = async (token: string) => {
  const options = {
    method: 'get',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/cartItem`,
    params: {
      shop,
    },
  };
  const res: CartItem[] = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const countCartitem = async (token: string) => {
  const options = {
    method: 'get',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/cartItem/count`,
  };

  const res: number = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const reservationCreateCart = async (
  token: string,
  id: string,
  reservationContent: ReservationContent
) => {
  const options = {
    method: 'post',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/reservation/${id}/cart`,
    data: {
      reservationContent,
      shop,
    },
  };
  return await axios(options).catch((e) => {
    throw new Error(e.response.data.errorCodes);
  });
};

const productCreateCart = async (token: string, id: string, orderContent: OrderContent) => {
  const options = {
    method: 'post',
    headers: {
      Authorization: `JWT ${token}`,
    },
    data: {
      orderContent,
      shop,
    },
    url: `${baseUrl}/product/${id}/cart`,
  };
  return await axios(options);
};

const cartItemGetTotalPrice = async (
  token: string,
  currentCouponIds: string[],
  deliveryMethod?: string
) => {
  const options = {
    method: 'get',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/cartItem/totalPrice`,
    params: {
      shop,
      currentCouponIds,
      deliveryMethod,
    },
  };
  const res: number = await axios(options).then((res) => {
    return res.data;
  });

  return res;
};

const cartItemGetPriceDetail = async (
  token: string,
  currentCouponIds: string[],
  deliveryMethod?: string
) => {
  const options = {
    method: 'get',
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

  const res: PriceDetail = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const updateCartItem = async (token: string, id: string, orderContent: OrderContent) => {
  const options = {
    method: 'put',
    headers: {
      Authorization: `JWT ${token}`,
    },
    data: {
      orderContent,
    },
    url: `${baseUrl}/cartItem/${id}`,
  };
  return await axios(options);
};

const removeCartItem = async (token: string, id: string) => {
  const options = {
    method: 'delete',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/cartItem/${id}`,
  };
  return await axios(options);
};

const cartItemListAvailableCoupons = async (token: string, id: string, quantity: number) => {
  const options = {
    method: 'get',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/cartItem/${id}/availableCoupons`,
    params: {
      quantity,
    },
  };
  const res: AvailabelCoupon[] = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const createCartItemOrder = async (
  token: string,
  stripeTokenId: string,
  contact: Contact,
  deliveryMethod: keyof typeof DeliveryMethodEnum,
  paymentMethod: keyof typeof PaymentMethodEnum,
  currentCouponIds: string[],
  pickUpStore?: string
) => {
  const options = {
    method: 'post',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/cartItem/order`,
    data: {
      currentCouponIds,
      stripeTokenId,
      contact,
      shop,
      deliveryMethod,
      paymentMethod,
      pickUpStore,
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

export {
  listCartItems,
  countCartitem,
  reservationCreateCart,
  productCreateCart,
  cartItemGetTotalPrice,
  cartItemGetPriceDetail,
  updateCartItem,
  removeCartItem,
  cartItemListAvailableCoupons,
  createCartItemOrder,
};
