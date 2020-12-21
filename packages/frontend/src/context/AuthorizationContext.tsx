import axios from 'axios';
import { createContext, PropsWithChildren, ReactNode, useContext, useEffect, useState } from 'react';
import { getTags } from '../api-types';

export interface AuthorizationContextValue {
  authorized: boolean;
  setToken: (token: string) => void;
}

const AuthorizationContext = createContext<AuthorizationContextValue>({
  authorized: false,
  setToken: () => {},
});

export interface AuthorizationRootProps {
  fallback?: ReactNode;
}

export default function AuthorizationRoot({ children, fallback }: PropsWithChildren<AuthorizationRootProps>) {
  const [token, setToken] = useState<string>();

  // Add request interceptor to inject authorization header
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((request) => {
      if (token) {
        request.withCredentials = true;
        request.headers = { ...request.headers, Authorization: `Bearer ${token}` };
      }

      return request;
    });

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  // Add response interceptor to handle 401 status codes and new tokens
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use((response) => {
      if (response.status === 401) {
        setToken(undefined);
      } else if (response.headers['x-new-token']) {
        setToken(response.headers['x-new-token']);
      }

      return response;
    });

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Do a request to get the state on load
  useEffect(() => {
    axios.defaults.baseURL = process.env.REACT_APP_SERVER_PATH;
    getTags({}).catch(() => {});
  }, []);

  return (
    <AuthorizationContext.Provider
      value={{
        authorized: !!token,
        setToken,
      }}
    >
      {token ? children : fallback}
    </AuthorizationContext.Provider>
  );
}

export function useAuthorizationContext() {
  return useContext(AuthorizationContext);
}
