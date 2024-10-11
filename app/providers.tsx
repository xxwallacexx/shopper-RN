import { ReactNode } from "react";
import Constants from "expo-constants"
import { TamaguiProvider, Theme } from "tamagui";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import config from "~/tamagui.config";
import { AuthProvider } from "~/hooks/authProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LocaleProvider } from "~/hooks/localeProvider";
import { StripeProvider } from "@stripe/stripe-react-native"
const { STRIPE_PUBLISHABLE_KEY } = process.env

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
  const scheme = Constants.expoConfig?.scheme as string

  return (
    <QueryClientProvider client={queryClient}>
      <StripeProvider
        publishableKey={STRIPE_PUBLISHABLE_KEY ?? ""}
        urlScheme={scheme}
      >
        <AuthProvider initialToken={initialToken} >
          <LocaleProvider initialLocale={initialLocale}>
            <TamaguiProvider config={config}>
              <Theme name="light">
                <Theme name="primary">
                  <SafeAreaProvider>
                    {children}
                  </SafeAreaProvider>
                </Theme>
              </Theme>
            </TamaguiProvider>
          </LocaleProvider>
        </AuthProvider>
      </StripeProvider>
    </QueryClientProvider>
  );
};

export default Providers;

