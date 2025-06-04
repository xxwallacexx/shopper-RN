import { API_URL, SHOP } from '@env';
import axios from 'axios';
const baseUrl = API_URL;
const shop = SHOP;

const getNotificationUnreadCount = async (token: string) => {
  const options = {
    method: 'get',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/notification/unreadCount`,
    params: {
      shop,
      'destination[]': 'USER',
    },
  };
  const res: number = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const listNotifications = async (token: string, skip: number) => {
  const options = {
    method: 'get',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/notification`,
    params: {
      skip,
      limit: 10,
      shop,
      'destination[]': 'USER',
    },
  };
  const res: Notification[] = await axios(options).then((res) => {
    return res.data.notifications;
  });
  return res;
};

const updateNotificationStatus = async (token: string, id: string, read: boolean) => {
  const options = {
    method: 'put',
    headers: {
      Authorization: `JWT ${token}`,
    },
    data: {
      read,
    },
    url: `${baseUrl}/notification/${id}`,
  };
  return axios(options);
};

export { getNotificationUnreadCount, listNotifications, updateNotificationStatus };
