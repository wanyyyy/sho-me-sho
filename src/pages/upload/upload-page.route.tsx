import type { RouteObject } from "react-router-dom";
import { lazyRoute, ROUTE_PATHS } from "@/shared/lib/react-router";

export const uploadPageRoute: RouteObject = {
  path: ROUTE_PATHS.UPLOAD,
  lazy: lazyRoute(() => import("./upload-page.ui"), "UploadPage"),
};
