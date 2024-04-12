import { ReactNode, useCallback, useMemo, useState } from 'react'

import { AuthContext } from './useAuth';



export const AuthProvider = ({ children, initialToken }: { children: ReactNode, initialToken: string }) => {
  const [token, setToken] = useState<string>(initialToken)


  const context = useMemo(
    () => ({
      token,
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  )
}


