import axios from 'axios'

import { API_URL } from '@env'
import { Reservation } from '~/types';
const baseUrl = API_URL

const listReservations = async (token: string, productId: string, timeMin: number, timeMax: number, skip: number) => {
  const options = {
    method: "get",
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/reservation`,
    params: {
      productId: productId,
      skip: skip,
      timeMin: timeMin,
      timeMax: timeMax,
      limit: 0,
      "status[]": "ACTIVE",
    },
  };
  let res: Reservation[] = await axios(options).then((res) => {
    return res.data.reservations
  })
  return res
}

export {
  listReservations
}
