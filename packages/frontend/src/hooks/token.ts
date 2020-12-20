import { useContext } from 'react';
import TokenContext from '../context/TokenContext';

export function useToken(): [string | null, (newToken: string | null) => void] {
  const ctx = useContext(TokenContext);
  return [ctx.token, ctx.setToken];
}

export function useHasToken() {
  const [token] = useToken();
  return token !== null;
}
