import { API_URL, SHOP } from '@env';
import axios from 'axios';

import { Auth } from '~/types';
const baseUrl = API_URL;
const shop = SHOP;

const login = async (email: string, password: string) => {
  const options = {
    method: 'post',
    url: `${baseUrl}/user/login`,
    data: {
      email,
      shop,
      password,
    },
  };
  const res: Auth = await axios(options)
    .then((res) => {
      return { token: res.data.token, tokenExpAt: res.data.tokenExpAt };
    })
    .catch((e) => {
      const error = new Error(e.response.data.errorCodes);
      throw error;
    });
  return res;
};

const facebookLogin = async (token: string) => {
  const options = {
    method: 'post',
    url: `${baseUrl}/user/login/facebook`,
    data: {
      token,
      shop,
    },
  };
  const res: Auth = await axios(options)
    .then((res) => {
      return { token: res.data.token, tokenExpAt: res.data.tokenExpAt };
    })
    .catch((e) => {
      const error = new Error(e.response.data.errorCodes);
      throw error;
    });
  return res;
};

const appleLogin = async (
  email: string | null,
  username: string,
  appleUser: string,
  identityToken: string | null
) => {
  const options = {
    method: 'post',
    url: `${baseUrl}/user/login/apple`,
    data: {
      email,
      username,
      appleUser,
      shop,
      identityToken,
    },
  };
  const res: Auth = await axios(options)
    .then((res) => {
      return { token: res.data.token, tokenExpAt: res.data.tokenExpAt };
    })
    .catch((e) => {
      const error = new Error(e.response.data.errorCodes);
      throw error;
    });
  return res;
};

const googleLogin = async (
  email: string,
  username: string,
  googleId: string,
  identityToken: string | null
) => {
  const options = {
    method: 'post',
    url: `${baseUrl}/user/login/google`,
    data: {
      email,
      username,
      googleId,
      shop,
      identityToken,
    },
  };
  const res: Auth = await axios(options)
    .then((res) => {
      return { token: res.data.token, tokenExpAt: res.data.tokenExpAt };
    })
    .catch((e) => {
      const error = new Error(e.response.data.errorCodes);
      throw error;
    });
  return res;
};

const createUser = async (username: string, email: string, password: string) => {
  const options = {
    method: 'post',
    url: `${baseUrl}/user`,
    data: {
      username,
      email,
      password,
      shop,
    },
  };
  const res: Auth = await axios(options)
    .then((res) => {
      return { token: res.data.token, tokenExpAt: res.data.tokenExpAt };
    })
    .catch((e) => {
      const error = new Error(e.response.data.errorCodes);
      throw error;
    });
  return res;
};

const createUserTemp = async () => {
  const options = {
    method: 'post',
    url: `${baseUrl}/user/temp`,
    data: {
      shop,
    },
  };
  const res: Auth = await axios(options).then((res) => {
    return res.data;
  });
  return res;
};

const resetPassword = async (token: string, password: string) => {
  const options = {
    method: 'put',
    headers: {
      Authorization: `JWT ${token}`,
    },
    data: {
      password,
    },
    url: `${baseUrl}/user/resetPassword`,
  };
  return await axios(options);
};

const removeUser = async (token: string) => {
  const options = {
    method: 'delete',
    headers: {
      Authorization: `JWT ${token}`,
    },
    url: `${baseUrl}/user/removeUser`,
  };
  return await axios(options);
};

export {
  login,
  facebookLogin,
  appleLogin,
  googleLogin,
  createUser,
  createUserTemp,
  resetPassword,
  removeUser,
};
