
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
  return await axios(options);
}

const listProducts = async (
  isRecommended: true,
  skip: number,
  category: string,
  sort: string,
  name: string,
  group: string,
  shopType: string,
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
  return await axios(options);
}
const getProduct = async (id: string) => {
  const options = {
    method: "get",
    url: `${baseUrl}/product/${id}`,
  };
  return await axios(options);
}


export {
  listCategories,
  listProducts,
  getProduct
}
