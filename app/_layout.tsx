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
      setIsInitializing(false)
    })()
  }, [])

  if (!loaded || isInitializing) {
    return (
      <></>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={config}>
        <Theme name="primary">
          <LocaleProvider initialLocale={locale}>
            <Stack screenOptions={({ navigation }) => ({
              title: "",
              headerLeft: () => {
                return (
                  <TouchableOpacity onPress={() => { return navigation.goBack() }}>
                    <AntDesign name="arrowleft" size={24} />
                  </TouchableOpacity>
                )
              },
              headerStyle: { backgroundColor: "#12baa6" }
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
  );
}

export default RootLayout
