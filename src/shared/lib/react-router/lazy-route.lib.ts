import type { LazyRouteFunction, RouteObject } from "react-router-dom";

type Loaded = {
  Component: React.ComponentType;
  loader?: RouteObject["loader"];
};

/** `lazy: lazyRoute(() => import("./x.ui"), "XPage")` 형태의 지연 로딩 헬퍼 */
export function lazyRoute<M extends Record<string, unknown>>(
  load: () => Promise<M>,
  component: keyof M & string,
  loader?: () => Promise<NonNullable<RouteObject["loader"]>>,
): LazyRouteFunction<RouteObject> {
  return async () => {
    const [mod, loaderFn] = await Promise.all([load(), loader?.()]);
    const result: Loaded = {
      Component: mod[component] as React.ComponentType,
    };
    if (loaderFn) result.loader = loaderFn;
    return result;
  };
}
