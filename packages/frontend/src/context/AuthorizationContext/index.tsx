import axios from 'axios';
import { createContext, PropsWithChildren, ReactNode, useContext, useEffect, useState } from 'react';
import { getTags } from '../../api-types';

export interface AuthorizationContextValue {
  isAuthorized: boolean;
  setIsAuthorized: (value: boolean) => void;
}

export const AuthorizationContext = createContext<AuthorizationContextValue>({
  isAuthorized: false,
  setIsAuthorized: () => {},
});

export interface AuthorizationRootProps {
  fallback?: ReactNode;
}

export default function AuthorizationRoot({ children, fallback }: PropsWithChildren<AuthorizationRootProps>) {
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Add request interceptor to inject authorization header
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((request) => {
      if (isAuthorized) {
        request.withCredentials = true;
        request.headers = { ...request.headers, Authorization: `Bearer ${isAuthorized}` };
      }

      return request;
    });

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [isAuthorized]);

  // Add response interceptor to handle 401 status codes and new tokens
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use((response) => {
      if (response.status === 401) {
        setIsAuthorized(false);
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
        isAuthorized,
        setIsAuthorized,
      }}
    >
      {isAuthorized ? children : fallback}
    </AuthorizationContext.Provider>
  );
}

export function useAuthorizationContext() {
  return useContext(AuthorizationContext);
}
