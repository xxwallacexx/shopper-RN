import { createContext, useContext } from "react";

export const AuthContext = createContext<{
  token: string
}>(null!);

export const useAuth = () => {
  return useContext(AuthContext);
};
