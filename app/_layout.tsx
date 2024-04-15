import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TamaguiProvider, Theme } from 'tamagui';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

import config from '~/tamagui.config';
import { LocaleProvider } from '~/hooks/localeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { AuthProvider } from '~/hooks/authProvider';
import { createUserTemp } from '~/api';
import moment from 'moment';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

const RootLayout = () => {
  const queryClient = new QueryClient();
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const [locale, setLocale] = useState("zh-Hant")
  const [token, setToken] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    (async () => {
      const locale = await AsyncStorage.getItem('locale')
      if (locale) {
        setLocale(locale)
      }
      // auth token
      let storedToken = await AsyncStorage.getItem("token");
      const tokenExpAt = await AsyncStorage.getItem("tokenExpAt");
      if (tokenExpAt && moment().isAfter(tokenExpAt)) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("tokenExpAt");
        storedToken = null
      }
      if (!storedToken) {
        const { token, tokenExpAt } = await createUserTemp().then((res) => { return res.data })
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("tokenExpAt", tokenExpAt);
        storedToken = token
      }
      setToken(storedToken)
      setIsInitializing(false)
    })()
  }, [])

  if (!loaded || !token || isInitializing) {
    return (
      <></>
    )
  }

  return (
    <AuthProvider initialToken={token}>
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={config}>
          <Theme name="primary">
            <LocaleProvider initialLocale={locale}>
              <Stack screenOptions={({ navigation }) => ({
                title: "",
                headerLeft: () => {
                  return (
                    <TouchableOpacity onPress={() => { return navigation.goBack() }}>
                      <AntDesign name="arrowleft" size={24} color={"#fff"} />
                    </TouchableOpacity>
                  )
                },
                headerStyle: { backgroundColor: process.env.EXPO_PUBLIC_PRIMARY_COLOR ?? "#fff" }
              })}>
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerShown: false
                  }}
                />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: 'modal' }}
                />
                <Stack.Screen
                  name="product"
                  options={{
                    headerShown: true,
                  }}
                />
              </Stack>
            </LocaleProvider>
          </Theme>
        </TamaguiProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default RootLayout
