import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { routePaths } from "@/shared/lib/react-router";
import { Button } from "@/shared/ui";
import { SHEET_LABELS, useCertificateStore } from "@/entities/certificate";

type EditorToolbarProps = {
  /** 주요 동작 (내보내기 등). 데스크톱은 상단 오른쪽, 모바일은 하단 고정 바 */
  actions?: ReactNode;
};

export function EditorToolbar({ actions }: EditorToolbarProps) {
  const navigate = useNavigate();
  const hasDocument = useCertificateStore((s) => s.document !== null);
  const close = useCertificateStore((s) => s.close);
  if (!hasDocument) return null;

  const reset = (
    <Button
      variant="ghost"
      onClick={() => {
        close();
        navigate(routePaths.home());
      }}
    >
      다른 파일 올리기
    </Button>
  );

  return (
    <>
      <header className="border-paper-200 flex items-center gap-3 border-b py-3">
        <h1 className="text-sm font-semibold sm:text-base">
          {SHEET_LABELS.titleJa} 번역
        </h1>
        <div className="flex-1" />
        <div className="hidden items-center gap-3 sm:flex">
          {reset}
          {actions}
        </div>
      </header>
      {/* 모바일: 엄지가 닿는 하단 고정 바 */}
      <div
        data-bottom-bar
        className="bg-paper-100/95 border-paper-200 fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-2 border-t px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur sm:hidden"
      >
        {reset}
        {actions}
      </div>
    </>
  );
}
