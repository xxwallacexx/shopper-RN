import axios from 'axios'

const baseUrl = process.env.EXPO_PUBLIC_API_URL;
const shop = process.env.EXPO_PUBLIC_SHOP;

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
