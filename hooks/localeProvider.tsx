import { ReactNode, useCallback, useMemo, useState } from 'react'
import { LocaleContext } from './useLocale'
import { I18n, Scope, TranslateOptions } from 'i18n-js';

import { messages } from '~/lib/messages';


const i18n = new I18n(messages)


export const LocaleProvider = ({ children, initialLocale }: { children: ReactNode, initialLocale: string }) => {
  const [locale, setLocale] = useState(initialLocale)

  const updateLocale = useCallback(
    (value: string) => {
      setLocale(value)
    },
    [locale]
  );

  const context = useMemo(
    () => ({
      t: (scope: Scope, options?: TranslateOptions) => i18n.t(scope, { locale, ...options }),
      locale,
      updateLocale,
    }),
    [locale, setLocale]
  );

  return (
    <LocaleContext.Provider value={context}>
      {children}
    </LocaleContext.Provider>
  )
}


