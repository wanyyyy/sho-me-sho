import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export function ErrorFallback() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "알 수 없는 오류가 발생했습니다.";

  return (
    <div
      role="alert"
      className="flex min-h-dvh flex-col items-center justify-center gap-2 text-center"
    >
      <h1 className="text-2xl font-semibold">문제가 발생했습니다</h1>
      <p className="text-ink-600 text-sm">{message}</p>
    </div>
  );
}
