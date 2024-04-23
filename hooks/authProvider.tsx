import { ReactNode, useCallback, useMemo, useState } from 'react'

import { AuthContext } from './useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';



export const AuthProvider = ({ children, initialToken }: { children: ReactNode, initialToken: string }) => {
  const [token, setToken] = useState<string | undefined>(initialToken)


  const signout = useCallback(
    async () => {
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('tokenExpAt')
      setToken(undefined)
    }, [])

  const signin = useCallback(async (token: string, tokenExpAt: string) => {
    await AsyncStorage.setItem('token', token)
    await AsyncStorage.setItem('tokenExpAt', tokenExpAt)
    setToken(token)
  }, [])

  const context = useMemo(
    () => ({
      token,
      signin,
      signout
    }),
    [token, signin, signout]
  );

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  )
}


