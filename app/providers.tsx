import { STRIPE_PUBLISHABLE_KEY, STRIPE_MERCHANT_IDENTIFIER } from '@env';
import { StripeProvider } from '@stripe/stripe-react-native';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme } from 'tamagui';

import { AuthProvider } from '~/hooks/authProvider';
import { LocaleProvider } from '~/hooks/localeProvider';
import config from '~/tamagui.config';

const scheme = Constants.expoConfig?.scheme as string;

const Providers = ({
  children,
  queryClient,
  initialLocale,
  initialToken,
}: {
  children: ReactNode;
  queryClient: QueryClient;
  initialLocale: string;
  initialToken: string;
}) => {
  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier={STRIPE_MERCHANT_IDENTIFIER}
      urlScheme={scheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider initialToken={initialToken}>
          <LocaleProvider initialLocale={initialLocale}>
            <TamaguiProvider config={config}>
              <Theme name="light">
                <SafeAreaProvider>{children}</SafeAreaProvider>
              </Theme>
            </TamaguiProvider>
          </LocaleProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StripeProvider>
  );
};

export default Providers;
