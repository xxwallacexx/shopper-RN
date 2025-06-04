import { API_URL, SHOP } from '@env';
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
  ProductComment,
  ProductPriceDetail,
  UserCoupon,
} from '~/types';
const baseUrl = API_URL;
const shop = SHOP;

const listCategories = async () => {
  const options = {
    method: 'get',
    url: `${baseUrl}/category`,
    params: {
      shop,
      status: 'ACTIVE',
    },
  };
  const res: Category[] = await axios(options)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      throw e;
    });
  return res;
};

const listProducts = async (
  skip: number,
  isRecommended?: boolean,
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
      shop,
      skip,
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
  const res: Product[] = await axios(options)
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

  const res: Product = await axios(options).then((res) => {
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

  const res: Option[] = await axios(options).then((res) => {
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
  const res: ProductPriceDetail = await axios(options).then((res) => {
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
  const res = axios(options).then((res) => {
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
  const res: { product: CheckoutProduct; coupon: CheckoutCoupon } = await axios(options).then(
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
  const res = await axios(options).then((res) => {
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
  const res: boolean = await axios(options).then((res) => {
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
      orderContent,
    },
  };
  const res: UserCoupon[] = await axios(options)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      throw new Error(e.response.data.errorCodes);
    });
  return res;
};

const createProductComment = async (token: string, id: string, formData: FormData) => {
  const options = {
    method: 'post',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/product/${id}/comment`,
    data: formData,
  };
  const res = await axios(options)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      throw new Error(e.response.data.errorCodes);
    });
  return res;
};

const listProductComments = async (id: string, skip: number) => {
  const options = {
    method: 'get',
    params: {
      skip,
      limit: 10,
    },
    url: `${baseUrl}/product/${id}/comment`,
  };
  const res: ProductComment[] = await axios(options).then((res) => {
    return res.data.productComments;
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
  createProductComment,
  listProductComments,
};
