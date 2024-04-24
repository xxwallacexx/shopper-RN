import axios from 'axios'
const baseUrl = process.env.EXPO_PUBLIC_API_URL;
const shop = process.env.EXPO_PUBLIC_SHOP;

const listCategories = async () => {
  const options = {
    method: "get",
    url: `${baseUrl}/category`,
    params: {
      shop: shop,
      status: "ACTIVE",
    },
  };
  let res: Category[] = await axios(options).then((res) => { return res.data }).catch((e) => { throw e })
  return res
}

const listProducts = async (
  isRecommended: true,
  skip: number,
  category?: string[],
  sort?: string,
  name?: string,
  group?: string,
  shopType?: string,
) => {
  const options = {
    method: "get",
    url: `${baseUrl}/product`,
    params: {
      shop: shop,
      skip: skip,
      limit: 10,
      status: "ACTIVE",
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
      return res.data.products
    })
    .catch((e) => { throw e })

  return res;
}
const getProduct = async (id: string) => {
  const options = {
    method: "get",
    url: `${baseUrl}/product/${id}`,
  };

  let res: Product = await axios(options).then((res) => {
    return res.data
  })
  return res;
}

const listOptions = async (id: string) => {
  const options = {
    method: "get",
    params: {
      status: ["ACTIVE"],
      suboptionStatus: ["ACTIVE"],
    },
    url: `${baseUrl}/product/${id}/options`,
  };

  let res: Option[] = await axios(options).then((res) => {
    return res.data
  })
  return res;
}

const getProductPriceDetail = async (token: string, productId: string, orderContent: OrderContent, currentCouponId?: string) => {
  const options = {
    method: "put",
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/product/${productId}/priceDetail`,
    data: {
      orderContent,
      currentCouponId
    }
  };
  console.log(options)
  let res = axios(options).then((res) => { return res.data })
  return res
}

const getProductCheckoutItemsDetail = async (
  token: string,
  productId: string,
  orderContent: OrderContent,
  currentCouponId?: string
) => {
  const options = {
    method: "put",
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/product/${productId}/checkoutItemsDetail`,
    data: {
      orderContent,
      currentCouponId,
    },
  };
  let res: { product: Product, coupon: Coupon } = await axios(options).then((res) => { return res.data })
  return res
}

const getProductStock = async (token: string, productId: string, choices?: string[]) => {
  const options = {
    method: "get",
    headers: {
      Authorization: `JWT ${token}`,
    },
    params: {
      choices
    },
    url: `${baseUrl}/product/${productId}/getStockByChoices`,
  };
  let res = await axios(options).then((res) => { return res.data })
  return res
}

const getProductIsBookmarked = async (token: string, productId: string) => {
  const options = {
    method: "get",
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/product/${productId}/isBookmarked`,
  };
  let res: boolean = await axios(options).then((res) => { return res.data })
  return res
}

export {
  listCategories,
  listProducts,
  getProduct,
  listOptions,
  getProductPriceDetail,
  getProductCheckoutItemsDetail,
  getProductStock,
  getProductIsBookmarked
}
