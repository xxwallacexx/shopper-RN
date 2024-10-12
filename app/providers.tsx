import { ReactNode } from "react";
import { TamaguiProvider, Theme } from "tamagui";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import config from "~/tamagui.config";
import { AuthProvider } from "~/hooks/authProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LocaleProvider } from "~/hooks/localeProvider";

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
  );
};

export default Providers;

