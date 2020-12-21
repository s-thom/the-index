import { createContext, useState } from 'react';

interface TokenContextValue {
  token: string | null;
  setToken: (newToken: string | null) => void;
}

const TokenContext = createContext<TokenContextValue>({
  token: null,
  // eslint-disable-next-line no-console
  setToken: (newToken) => console.warn('Tried to set token context without provider', newToken),
});

export default TokenContext;

interface TokenContextProviderProps {
  children: React.ReactNode;
}

const TOKEN_KEY = 'token';

export function TokenContextProvider({ children }: TokenContextProviderProps) {
  const [currentValue, setCurrentValue] = useState<string | null>(localStorage.getItem(TOKEN_KEY));

  function setToken(newValue: string | null) {
    if (newValue === null) {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      localStorage.setItem(TOKEN_KEY, newValue);
    }

    setCurrentValue(newValue);
  }

  return <TokenContext.Provider value={{ token: currentValue, setToken }}>{children}</TokenContext.Provider>;
}
