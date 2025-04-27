import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Số lần retry khi fetch fail
      staleTime: 1000 * 60 * 5, // Data được coi là "cũ" sau 5 phút
    },
  },
});