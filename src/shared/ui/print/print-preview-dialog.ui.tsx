import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "../button.ui";
import { type PrintOrientation, PrintSheet } from "./print-sheet.ui";
import { printElement } from "./print.lib";

const DIALOG_WIDTH_CLASS: Record<PrintOrientation, string> = {
  portrait: "w-[calc(210mm+4rem)]",
  landscape: "w-[calc(297mm+4rem)]",
};

type PrintPreviewDialogProps = {
  open: boolean;
  onClose: () => void;
  /** 인쇄·PDF 저장 시 파일명으로 쓰이는 문서 제목 */
  documentTitle: string;
  /** 미리보기 용지 방향. 인쇄창의 용지·방향 설정은 잠그지 않는다 */
  orientation?: PrintOrientation;
  /** 용지 안에 들어갈 내용 */
  children: ReactNode;
};

/**
 * 인쇄 미리보기. 내용을 A4 시트에 담아 보여 주고, 출력은 그 시트만 복제한다.
 * 화면이 용지보다 좁으면 시트를 축소해 전체가 보이게 한다 (인쇄에는 영향 없음)
 */
export function PrintPreviewDialog({
  open,
  onClose,
  documentTitle,
  orientation = "portrait",
  children,
}: PrintPreviewDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const fit = useFitScale(viewportRef, sheetRef, open);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="인쇄 미리보기"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={cn(
        "bg-paper-100 text-ink-900 m-auto max-h-[90dvh] max-w-[calc(100vw-1rem)] rounded-xl p-0 shadow-xl backdrop:bg-black/40",
        DIALOG_WIDTH_CLASS[orientation],
      )}
    >
      <div className="flex max-h-[90dvh] flex-col">
        <header className="border-paper-200 flex items-center justify-between border-b px-4 py-3 sm:px-5">
          <h2 className="text-base font-semibold">미리보기</h2>
          <Button variant="ghost" onClick={onClose}>
            닫기
          </Button>
        </header>
        <div
          ref={viewportRef}
          className="min-h-0 flex-1 overflow-auto p-2 sm:p-4"
        >
          {/* 축소는 바깥 래퍼에만 걸어 복제되는 시트에는 transform 이 남지 않게 한다 */}
          <div
            className="mx-auto overflow-hidden"
            style={fit ? { width: fit.width, height: fit.height } : undefined}
          >
            <div
              style={
                fit
                  ? {
                      transform: `scale(${fit.scale})`,
                      transformOrigin: "top left",
                    }
                  : undefined
              }
            >
              <PrintSheet ref={sheetRef} orientation={orientation}>
                {children}
              </PrintSheet>
            </div>
          </div>
        </div>
        <footer className="border-paper-200 flex justify-end gap-2 border-t px-4 py-3 sm:px-5">
          <Button
            onClick={() => {
              if (sheetRef.current)
                void printElement(sheetRef.current, documentTitle);
            }}
          >
            인쇄 · PDF 저장
          </Button>
        </footer>
      </div>
    </dialog>
  );
}

type Fit = { scale: number; width: number; height: number };

/** 시트를 뷰포트 폭에 맞추는 배율(1 이하)과 축소 후 크기. 창 크기가 바뀌면 다시 잰다 */
function useFitScale(
  viewportRef: React.RefObject<HTMLElement | null>,
  sheetRef: React.RefObject<HTMLElement | null>,
  active: boolean,
): Fit | null {
  const [fit, setFit] = useState<Fit | null>(null);
  useEffect(() => {
    const viewport = viewportRef.current;
    const sheet = sheetRef.current;
    if (!active || !viewport || !sheet) return;
    const measure = () => {
      const available = viewport.clientWidth - 16; // 패딩 여유
      const { offsetWidth: w, offsetHeight: h } = sheet;
      if (w === 0) return;
      const scale = Math.min(1, available / w);
      setFit({ scale, width: w * scale, height: h * scale });
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(sheet);
    return () => observer.disconnect();
  }, [viewportRef, sheetRef, active]);
  return fit;
}
