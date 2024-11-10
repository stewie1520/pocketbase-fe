import { isServer, QueryClient } from "@tanstack/react-query";

const MAX_RETRIES = 1;

const generateQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Don't retry for certain error responses
        retry: (failureCount) => {
          return failureCount <= MAX_RETRIES;
        },
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
};

let browserQueryClient: QueryClient | undefined = undefined;

// https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#initial-setup
export const getQueryClient = () => {
  if (isServer) {
    // Server: always make a new query client
    return generateQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = generateQueryClient();
    return browserQueryClient;
  }
};
