import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import Constants from 'expo-constants';
import { ReactNode, useCallback, useMemo, useState } from 'react';

import { AuthContext } from './useAuth';

import { createUserTemp, updateInstallation } from '~/api';

const scheme = Constants.expoConfig?.scheme as string;

export const AuthProvider = ({
  children,
  initialToken,
}: {
  children: ReactNode;
  initialToken: string;
}) => {
  const [token, setToken] = useState<string | undefined>(initialToken);

  const signout = useCallback(async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('tokenExpAt');
    const { token, tokenExpAt } = await createUserTemp();
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('tokenExpAt', tokenExpAt);
    setToken(token);
  }, []);

  const signin = useCallback(async (token: string, tokenExpAt: string) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('tokenExpAt', tokenExpAt);
    setToken(token);
    const authStatus = await messaging().hasPermission();
    if (authStatus !== messaging.AuthorizationStatus.AUTHORIZED) {
      await messaging().requestPermission();
    } else {
      const fcmToken = await messaging().getToken();
      await updateInstallation(fcmToken, scheme, token);
    }
  }, []);

  const context = useMemo(
    () => ({
      token,
      signin,
      signout,
    }),
    [token, signin, signout]
  );

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
};
