import { Scope, TranslateOptions } from "i18n-js";
import { createContext, useContext } from "react";

export const LocaleContext = createContext<{
  t: <T = string>(scope: Scope, options?: TranslateOptions) => string | T;
  locale: string;
  updateLocale: (value: string) => void;
}>(null!);

export const useLocale = () => {
  return useContext(LocaleContext);
};
