import axios from 'axios';
import {
  Category,
  CheckoutCoupon,
  CheckoutProduct,
  Contact,
  DeliveryMethodEnum,
  Option,
  OrderContent,
  PaymentMethodEnum,
  Product,
  ProductPriceDetail,
  UserCoupon,
} from '~/types';
import { API_URL, SHOP } from '@env';
const baseUrl = API_URL;
const shop = SHOP;

const listCategories = async () => {
  const options = {
    method: 'get',
    url: `${baseUrl}/category`,
    params: {
      shop: shop,
      status: 'ACTIVE',
    },
  };
  let res: Category[] = await axios(options)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      throw e;
    });
  return res;
};

const listProducts = async (
  isRecommended: true,
  skip: number,
  category?: string[],
  sort?: string,
  name?: string,
  group?: string,
  shopType?: string
) => {
  const options = {
    method: 'get',
    url: `${baseUrl}/product`,
    params: {
      shop: shop,
      skip: skip,
      limit: 10,
      status: 'ACTIVE',
      isRecommended,
      category,
      sort,
      name,
      group,
      shopType,
    },
  };
  let res: Product[] = await axios(options)
    .then((res) => {
      return res.data.products;
    })
    .catch((e) => {
      throw e;
    });

  return res;
};
const getProduct = async (id: string) => {
  const options = {
    method: 'get',
    url: `${baseUrl}/product/${id}`,
  };

  let res: Product = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const listOptions = async (id: string) => {
  const options = {
    method: 'get',
    params: {
      status: ['ACTIVE'],
      suboptionStatus: ['ACTIVE'],
    },
    url: `${baseUrl}/product/${id}/options`,
  };

  let res: Option[] = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const getProductPriceDetail = async (
  token: string,
  productId: string,
  orderContent: OrderContent,
  currentCouponId?: string
) => {
  const options = {
    method: 'put',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/product/${productId}/priceDetail`,
    data: {
      orderContent,
      currentCouponId,
    },
  };
  let res: ProductPriceDetail = axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const getProductTotalPrice = async (
  token: string,
  productId: string,
  orderContent: OrderContent,
  deliveryMethod: keyof typeof DeliveryMethodEnum,
  currentCouponId?: string
) => {
  const options = {
    method: 'put',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/product/${productId}/totalPrice`,
    data: {
      orderContent,
      deliveryMethod,
      currentCouponId,
    },
  };
  let res = axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const getProductCheckoutItemsDetail = async (
  token: string,
  productId: string,
  orderContent: OrderContent,
  currentCouponId?: string
) => {
  const options = {
    method: 'put',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/product/${productId}/checkoutItemsDetail`,
    data: {
      orderContent,
      currentCouponId,
    },
  };
  let res: { product: CheckoutProduct; coupon: CheckoutCoupon } = await axios(options).then(
    (res) => {
      return res.data;
    }
  );
  return res;
};

const getProductStock = async (token: string, productId: string, choices?: string[]) => {
  const options = {
    method: 'get',
    headers: {
      Authorization: `JWT ${token}`,
    },
    params: {
      choices,
    },
    url: `${baseUrl}/product/${productId}/getStockByChoices`,
  };
  let res = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const getProductIsBookmarked = async (token: string, productId: string) => {
  const options = {
    method: 'get',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/product/${productId}/isBookmarked`,
  };
  let res: boolean = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const createProductOrder = async (
  token: string,
  id: string,
  stripeTokenId: string,
  contact: Contact,
  orderContent: OrderContent,
  deliveryMethod: keyof typeof DeliveryMethodEnum,
  paymentMethod: keyof typeof PaymentMethodEnum,
  currentCouponId?: string,
  pickUpStore?: string
) => {
  const options = {
    method: 'post',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/product/${id}/order`,
    data: {
      currentCouponId,
      stripeTokenId,
      contact,
      shop,
      orderContent,
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

const listProductAvailableCoupons = async (
  token: string,
  id: string,
  orderContent: OrderContent
) => {
  const options = {
    method: 'put',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/product/${id}/availableCoupons`,
    data: {
      orderContent: orderContent,
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

export {
  listCategories,
  listProducts,
  getProduct,
  listOptions,
  getProductPriceDetail,
  getProductTotalPrice,
  getProductCheckoutItemsDetail,
  getProductStock,
  getProductIsBookmarked,
  createProductOrder,
  listProductAvailableCoupons,
};
