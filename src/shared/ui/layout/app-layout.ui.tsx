import { cn } from "@/shared/lib/utils";

type AppLayoutProps = { className?: string; children: React.ReactNode };

/**
 * 앱 공통 프레임. 데스크톱 중심(문서 업로드·번역 편집)이므로 최대 1200px 중앙 정렬,
 * 모바일에서는 좌우 16px 여백만 둔다.
 */
export function AppLayout({ className, children }: AppLayoutProps) {
  return (
    <div
      className={cn(
        "mx-auto min-h-dvh w-full max-w-[1200px] px-4 sm:px-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
