/* istanbul ignore file */

// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { PropsWithChildren, useMemo } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

function TestProviderWrapper({ children }: PropsWithChildren<{}>) {
  // Create a query client for each wrapper instance.
  // This ensures there is no overlap between tests
  const queryClient = useMemo(
    () =>
      new QueryClient({
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
      }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

const customRender = ((ui: any, options: any) =>
  render(ui, { wrapper: TestProviderWrapper, ...options })) as typeof render;

// Re-export testing library
// eslint-disable-next-line import/no-extraneous-dependencies
export * from '@testing-library/react';

// But override the render function
export { customRender as render };
