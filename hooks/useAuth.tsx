import { createContext, useContext } from 'react';

export const AuthContext = createContext<{
  token?: string;
  signin: (token: string, tokenExpAt: string) => Promise<void>;
  signout: () => Promise<void>;
}>(null!);

export const useAuth = () => {
  return useContext(AuthContext);
};
