import axios from 'axios'

const baseUrl = process.env.EXPO_PUBLIC_API_URL;
const shop = process.env.EXPO_PUBLIC_SHOP;

const getShop = async () => {
  const options = {
    method: "get",
    url: `${baseUrl}/shop/${shop}`,
  };
  let res: Shop = await axios(options).then((res) => { return res.data })
  return res
}



export {
  getShop
}
