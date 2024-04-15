import axios from 'axios'
import moment from 'moment';

const baseUrl = process.env.EXPO_PUBLIC_API_URL;
const shop = process.env.EXPO_PUBLIC_SHOP;

const listCoupons = async (token: string, skip: number, sort: string, productId?: string) => {
  const options = {
    method: "get",
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/coupon`,
    params: {
      shop: shop,
      skip: skip,
      endDateMin: moment().valueOf(),
      productId: productId,
      limit: 10,
      sort: sort,
    },
  };
  let res: Coupon[] = await axios(options).then((res) => { return res.data.coupons })
  return res
}
export {
  listCoupons
}
