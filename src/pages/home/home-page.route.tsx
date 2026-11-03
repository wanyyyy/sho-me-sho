import type { RouteObject } from "react-router-dom";
import { lazyRoute, ROUTE_PATHS } from "@/shared/lib/react-router";

export const homePageRoute: RouteObject = {
  path: ROUTE_PATHS.HOME,
  lazy: lazyRoute(() => import("./home-page.ui"), "HomePage"),
};
