import { Suspense } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter } from 'react-router-dom';
import BodyArea from '../components/BodyArea';
import LoadingPage from '../components/LoadingPage';
import LoggedInApp from '../components/LoggedInApp';
import LoggedOutApp from '../components/LoggedOutApp';
import AuthorizationRoot from '../context/AuthorizationContext';
import './index.css';

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
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingPage />}>
          <BrowserRouter>
            <BodyArea>
              <AuthorizationRoot fallback={<LoggedOutApp />}>
                <LoggedInApp />
              </AuthorizationRoot>
            </BodyArea>
          </BrowserRouter>
        </Suspense>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </QueryClientProvider>
    </div>
  );
}
