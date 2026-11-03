import {
  createBrowserRouter,
  RouterProvider as ReactRouterProvider,
  redirect,
} from "react-router-dom";
import { routePaths, ROUTE_PATHS } from "@/shared/lib/react-router";
import { ErrorFallback, FallbackLoading } from "@/shared/ui";
import { editorPageRoute } from "@/pages/editor";
import { error404PageRoute } from "@/pages/error";
import { homePageRoute } from "@/pages/home";

const browserRouter = createBrowserRouter([
  {
    errorElement: <ErrorFallback />,
    HydrateFallback: FallbackLoading,
    children: [
      { path: ROUTE_PATHS.ROOT, loader: () => redirect(routePaths.home()) },
      homePageRoute,
      editorPageRoute,
      error404PageRoute,
      { path: "*", loader: () => redirect(routePaths.errorPage404()) },
    ],
  },
]);

export function RouterProvider() {
  return <ReactRouterProvider router={browserRouter} />;
}
