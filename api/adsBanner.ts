import axios from 'axios'
import { Banner } from '~/types'
import { API_URL, SHOP } from '@env'
const baseUrl = API_URL
const shop = SHOP

const listAdsBanners = async () => {
  const options = {
    method: "get",
    url: `${baseUrl}/adsBanner`,
    params: {
      shop: shop,
      skip: 0,
      limit: 0,
      "status[]": "ACTIVE",
    },
  };

  let res: Banner[] = await axios(options).then((res) => { return res.data.adsBanners }).catch((e) => { throw (e) });

  return res
}

export {
  listAdsBanners
}
