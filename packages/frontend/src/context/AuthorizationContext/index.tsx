import axios from 'axios';
import { createContext, PropsWithChildren, ReactNode, useContext, useEffect, useState } from 'react';
import { getV2UserId } from '../../api-types';

export interface AuthorizationContextValue {
  isAuthorized: boolean;
  setIsAuthorized: (value: boolean) => void;
}

export const AuthorizationContext = createContext<AuthorizationContextValue>({
  isAuthorized: false,
  setIsAuthorized: () => {},
});

export interface AuthorizationRootProps {
  unauthorized?: ReactNode;
  loading?: ReactNode;
}

export default function AuthorizationRoot({
  children,
  unauthorized: unauthorizedChildren,
  loading: loadingChildren,
}: PropsWithChildren<AuthorizationRootProps>) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    getV2UserId({ name: 'me' }).then(
      () => {
        setIsAuthorized(true);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      },
    );
  }, []);

  if (isLoading) {
    return <>{loadingChildren}</>;
  }

  return (
    <AuthorizationContext.Provider
      value={{
        isAuthorized,
        setIsAuthorized,
      }}
    >
      {isAuthorized ? children : unauthorizedChildren}
    </AuthorizationContext.Provider>
  );
}

export function useAuthorizationContext() {
  return useContext(AuthorizationContext);
}
