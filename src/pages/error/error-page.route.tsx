import type { RouteObject } from "react-router-dom";
import { lazyRoute, ROUTE_PATHS } from "@/shared/lib/react-router";

export const error404PageRoute: RouteObject = {
  path: ROUTE_PATHS.ERROR_PAGE_404,
  lazy: lazyRoute(() => import("./error-404-page.ui"), "Error404Page"),
};
