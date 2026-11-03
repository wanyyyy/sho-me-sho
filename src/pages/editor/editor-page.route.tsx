import type { RouteObject } from "react-router-dom";
import { lazyRoute, ROUTE_PATHS } from "@/shared/lib/react-router";

export const editorPageRoute: RouteObject = {
  path: ROUTE_PATHS.EDITOR,
  lazy: lazyRoute(() => import("./editor-page.ui"), "EditorPage"),
};
