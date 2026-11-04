import { cn } from "@/shared/lib/utils";

type AppLayoutProps = { className?: string; children: React.ReactNode };

export const CONTACT_EMAIL = "wanylog@naver.com";

/**
 * 앱 공통 프레임. 데스크톱 중심(문서 업로드·번역 편집)이므로 최대 1200px 중앙 정렬,
 * 모바일에서는 좌우 16px 여백만 둔다. 문의 푸터는 어느 화면에서나 보인다.
 * 안쪽에 data-bottom-bar(모바일 하단 고정 바)가 있으면 그 높이만큼 아래 여백을 더한다
 */
export function AppLayout({ className, children }: AppLayoutProps) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full max-w-[1200px] flex-col px-4 has-[[data-bottom-bar]]:pb-16 sm:px-6 sm:has-[[data-bottom-bar]]:pb-0",
        className,
      )}
    >
      <div className="flex flex-1 flex-col">{children}</div>
      <footer className="text-ink-400 border-paper-200 mt-8 border-t py-4 text-center text-xs">
        문의{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="hover:text-ink-600 underline-offset-2 hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
      </footer>
    </div>
  );
}
