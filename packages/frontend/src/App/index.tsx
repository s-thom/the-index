import { Suspense } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import BodyArea from '../components/BodyArea';
import LoggedInApp from '../components/LoggedInApp';
import LoggedOutApp from '../components/LoggedOutApp';
import AuthorizationRoot from '../context/AuthorizationContext';
import LoadingPage from '../pages/LoadingPage';
import GlobalStyle, { theme } from './styled';

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
        <Suspense fallback={<LoadingPage />}>
          <BrowserRouter>
            <div>
              <BodyArea>
                <AuthorizationRoot fallback={<LoggedOutApp />}>
                  <LoggedInApp />
                </AuthorizationRoot>
              </BodyArea>
            </div>
          </BrowserRouter>
        </Suspense>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
