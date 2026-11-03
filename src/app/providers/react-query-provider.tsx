import { QueryClientProvider as TanStackQueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/shared/lib/react-query";

type QueryClientProviderProps = {
  children: React.ReactNode;
};

export function QueryClientProvider({ children }: QueryClientProviderProps) {
  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </TanStackQueryClientProvider>
  );
}
