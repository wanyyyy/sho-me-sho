import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      // 조회 실패는 ErrorBoundary 로. mutation 은 각 폼에서 isError 로 처리
      throwOnError: true,
    },
    mutations: { retry: 0 },
  },
});
