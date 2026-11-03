import { AppLayout } from "@/shared/ui";
import { AccessGate } from "@/features/access-gate";
import { QueryClientProvider, RouterProvider } from "./providers";

export function AppProviders() {
  return (
    <QueryClientProvider>
      <AppLayout>
        <AccessGate>
          <RouterProvider />
        </AccessGate>
      </AppLayout>
    </QueryClientProvider>
  );
}
