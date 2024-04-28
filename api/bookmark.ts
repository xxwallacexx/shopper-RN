import axios from 'axios'

import { API_URL, SHOP } from '@env'
const baseUrl = API_URL
const shop = SHOP

const listBookmarks = async (token: string, skip: number) => {
  const options = {
    method: "get",
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/bookmark`,
    params: {
      shop: shop,
      skip: skip,
      limit: 10,
    },
  };
  let res = await axios(options).then((res) => {
    return res.data.bookmarks
  })
  return res
}

const createBookmark = async (token: string, productId: string) => {
  const options = {
    method: "post",
    headers: {
      Authorization: `JWT ${token}`,
    },
    data: {
      productId: productId,
    },
    url: `${baseUrl}/product/${productId}/createBookmark`,
  };
  return await axios(options);
}

const removeBookmark = async (token: string, productId: string) => {
  const options = {
    method: "delete",
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/product/${productId}/removeBookmark`,
  };
  return await axios(options);
}



export {
  listBookmarks,
  createBookmark,
  removeBookmark
}
