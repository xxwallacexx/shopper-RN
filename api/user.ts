import axios from 'axios'

const baseUrl = process.env.EXPO_PUBLIC_API_URL;
const shop = process.env.EXPO_PUBLIC_SHOP;

const getCredit = async (token: string) => {
  const options = {
    method: "get",
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/shop/${shop}/chainCredit`,
  };
  let res: number = await axios(options).then((res) => { return res.data })
  return res
}

const getSelf = async (token: string) => {
  const options = {
    method: "get",
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/user/self`,
  };
  let res: User = await axios(options).then((res) => { return res.data })
  console.log(res)
  return res
}
export {
  getCredit,
  getSelf
}
