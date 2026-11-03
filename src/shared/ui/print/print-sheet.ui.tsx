import type { ReactNode, Ref } from "react";
import { cn } from "@/shared/lib/utils";

export type PrintOrientation = "portrait" | "landscape";

/* 인쇄 시 높이 = 용지 - @page 여백(12mm×2). 살짝 줄여 둘째 장으로 넘치지 않게 */
const SHEET_CLASS: Record<PrintOrientation, string> = {
  portrait: "min-h-[297mm] w-[210mm] print:min-h-[271mm]",
  landscape: "min-h-[210mm] w-[297mm] print:min-h-[184mm]",
};

type PrintSheetProps = {
  orientation: PrintOrientation;
  ref?: Ref<HTMLDivElement>;
  children: ReactNode;
};

/** A4 용지 1장. 화면에서는 종이 모양, 인쇄 시에는 여백·그림자 없이 본문만 */
export function PrintSheet({ orientation, ref, children }: PrintSheetProps) {
  return (
    <div
      ref={ref}
      data-orientation={orientation}
      className={cn(
        "mx-auto flex flex-col bg-white p-[12mm] text-[11px] text-black shadow-md",
        SHEET_CLASS[orientation],
        "print:w-auto print:p-0 print:shadow-none",
      )}
    >
      {children}
    </div>
  );
}
