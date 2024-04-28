import axios from 'axios'
import { Address, User } from '~/types';
import { API_URL, SHOP } from '@env'
const baseUrl = API_URL
const shop = SHOP

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

const updateSelf = async (token: string, username: string, email?: string, address?: Address) => {
  const options = {
    method: "put",
    headers: {
      Authorization: `JWT ${token}`,
    },
    data: {
      username: username,
      email: email,
      address: address,
    },
    url: `${baseUrl}/user/self`,
  };
  return await axios(options).catch((e) => {
    console.log(e)
    let error = new Error(e.response.data.errorCodes)
    throw (error)
  })
}

export {
  getCredit,
  getSelf,
  updateSelf
}
