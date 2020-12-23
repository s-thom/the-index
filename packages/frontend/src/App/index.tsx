import { Suspense } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import AuthorizationRoot from '../context/AuthorizationContext';
import LoadingPage from '../pages/LoadingPage';
import LoggedInApp from './LoggedInApp';
import LoggedOutApp from './LoggedOutApp';
import GlobalStyle, { theme } from './styled';

const AppBody = styled.div`
  max-width: 70em;
  margin: 0 auto;
`;

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
