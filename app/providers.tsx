import { ReactNode } from "react";
import { TamaguiProvider, Theme } from "tamagui";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import config from "~/tamagui.config";
import { AuthProvider } from "~/hooks/authProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LocaleProvider } from "~/hooks/localeProvider";
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_PUBLISHABLE_KEY, STRIPE_MERCHANT_IDENTIFIER } from "@env"
import Constants from "expo-constants"
const scheme = Constants.expoConfig?.scheme as string

const Providers = ({
  children,
  queryClient,
  initialLocale,
  initialToken,
}: {
  children: ReactNode,
  queryClient: QueryClient,
  initialLocale: string,
  initialToken: string,
}) => {

  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier={STRIPE_MERCHANT_IDENTIFIER}
      urlScheme={scheme} // required for 3D Secure and bank redirects
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider initialToken={initialToken} >
          <LocaleProvider initialLocale={initialLocale}>
            <TamaguiProvider config={config}>
              <Theme name="light">
                <SafeAreaProvider>
                  {children}
                </SafeAreaProvider>
              </Theme>
            </TamaguiProvider>
          </LocaleProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StripeProvider>
  );
};

export default Providers;

