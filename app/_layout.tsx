import { PRIMARY_COLOR } from '@env';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { QueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast, { ErrorToast } from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

import Providers from './providers';
import { BackButton } from '~/components';

import { createUserTemp, updateInstallation } from '~/api';
SplashScreen.preventAutoHideAsync();
const scheme = Constants.expoConfig?.scheme as string;

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

const queryClient = new QueryClient();

const RootLayout = () => {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const [locale, setLocale] = useState('zh-Hant');
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    (async () => {
      GoogleSignin.configure();
      const locale = await AsyncStorage.getItem('locale');
      if (locale) {
        setLocale(locale);
      }
      // auth token
      let storedToken = await AsyncStorage.getItem('token');
      const tokenExpAt = await AsyncStorage.getItem('tokenExpAt');
      if (tokenExpAt && moment().isAfter(tokenExpAt)) {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('tokenExpAt');
        storedToken = null;
      }
      if (!storedToken) {
        const { token, tokenExpAt } = await createUserTemp();
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('tokenExpAt', tokenExpAt);
        storedToken = token;
      }
      setToken(storedToken);
      setIsInitializing(false);

      await requestTrackingPermissionsAsync();

      //fcm
      const authStatus = await messaging().hasPermission();
      if (authStatus !== messaging.AuthorizationStatus.AUTHORIZED) {
        await messaging().requestPermission();
      } else {
        const fcmToken = await messaging().getToken();
        await updateInstallation(fcmToken, scheme, storedToken);
      }
    })();
  }, []);

  if (!loaded || !token || isInitializing) {
    return <></>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Providers queryClient={queryClient} initialLocale={locale} initialToken={token}>
        <Stack
          screenOptions={() => ({
            title: '',
            headerLeft: () => <BackButton />,
            headerStyle: { backgroundColor: PRIMARY_COLOR ?? '#fff' },
          })}>
          <Stack.Screen
            name="(app)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </Providers>
      <Toast
        config={{
          error: (props) => (
            <ErrorToast
              {...props}
              style={{ borderLeftColor: PRIMARY_COLOR ?? '#000' }}
              contentContainerStyle={{ backgroundColor: 'red' }}
              text1Style={{
                fontSize: 17,
                color: '#fff',
              }}
              text2Style={{
                fontSize: 15,
                color: '#fff',
              }}
            />
          ),
        }}
        visibilityTime={1000}
      />
    </GestureHandlerRootView>
  );
};

export default RootLayout;
