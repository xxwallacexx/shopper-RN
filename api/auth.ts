import axios from 'axios'

const baseUrl = process.env.EXPO_PUBLIC_API_URL;
const shop = process.env.EXPO_PUBLIC_SHOP;

const login = async (email: string, password: string) => {
  const options = {
    method: "post",
    url: `${baseUrl}/user/login`,
    data: {
      email,
      shop,
      password,
    },
  };
  return await axios(options);
}

const facebookLogin = async (token: string) => {
  const options = {
    method: 'post',
    url: `${baseUrl}/user/login/facebook`,
    data: {
      token: token,
      shop: shop,
    },
  };
  return await axios(options);
}

const appleLogin = async (email: string, username: string, appleUser: string, identityToken: string) => {
  const options = {
    method: "post",
    url: `${baseUrl}/user/login/apple`,
    data: {
      email: email,
      username: username,
      appleUser: appleUser,
      shop: shop,
      identityToken,
    },
  };
  return await axios(options);
}

const googleLogin = async (email: string, username: string, googleId: string, identityToken: string) => {
  const options = {
    method: "post",
    url: `${baseUrl}/user/login/google`,
    data: {
      email,
      username,
      googleId,
      shop: shop,
      identityToken,
    },
  };
  return await axios(options);
}

const createUser = async (username: string, email: string, password: string) => {
  const options = {
    method: "post",
    url: `${baseUrl}/user`,
    data: {
      username,
      email,
      password,
      shop,
    },
  };
  return await axios(options);
}

const createUserTemp = async () => {
  const options = {
    method: "post",
    url: `${baseUrl}/user/temp`,
    data: {
      shop,
    },
  };
  return await axios(options);
}


const resetPassword = async (token: string, password: string) => {
  const options = {
    method: "put",
    headers: {
      Authorization: `JWT ${token}`,
    },
    data: {
      password: password,
    },
    url: `${baseUrl}/user/resetPassword`,
  };
  return await axios(options);
}


export {
  login,
  facebookLogin,
  appleLogin,
  googleLogin,
  createUser,
  createUserTemp,
  resetPassword

}
