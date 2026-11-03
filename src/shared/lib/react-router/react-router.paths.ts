/** 라우트 정의용 세그먼트 */
export const ROUTE_PATHS = {
  ROOT: "",
  HOME: "home",
  EDITOR: "editor",
  ERROR_PAGE_404: "404",
} as const;

/** 링크/리다이렉트용 절대 경로 */
export const routePaths = {
  home: () => `/${ROUTE_PATHS.HOME}`,
  editor: () => `/${ROUTE_PATHS.EDITOR}`,
  errorPage404: () => `/${ROUTE_PATHS.ERROR_PAGE_404}`,
};
