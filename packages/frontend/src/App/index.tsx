import { Suspense } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import LoggedInApp from './LoggedInApp';
import LoggedOutApp from './LoggedOutApp';
import AuthorizationRoot from '../context/AuthorizationContext';
import LoadingPage from '../pages/LoadingPage';
import GlobalStyle, { AppBody, theme } from './styled';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache(),
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <BrowserRouter>
          <Suspense fallback={<LoadingPage />}>
            <AppBody>
              <AuthorizationRoot fallback={<LoggedOutApp />}>
                <LoggedInApp />
              </AuthorizationRoot>
            </AppBody>
          </Suspense>
        </BrowserRouter>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
