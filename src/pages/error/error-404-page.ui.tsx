import { Link } from "react-router-dom";
import { routePaths } from "@/shared/lib/react-router";
import { Button } from "@/shared/ui";

export function Error404Page() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="text-ink-600 text-sm">페이지를 찾을 수 없습니다.</p>
      <Link to={routePaths.home()}>
        <Button variant="ghost">홈으로</Button>
      </Link>
    </main>
  );
}
