import { cn } from "@/shared/lib/utils";

/** 양식 안 입력칸 공통 스타일 (편집 화면의 칸, 번역자 정보 입력) */
export const sheetInputClassName =
  "h-6 rounded-sm border bg-white px-1 text-[11px] text-black outline-none focus:border-accent-600";

const border = "border border-black";

/** 표 머릿글·본문 셀 공통 스타일 (모든 양식 시트가 같은 선 굵기·여백을 쓴다) */
export const sheetCellClass = {
  head: cn(
    border,
    "bg-white px-1.5 py-1 text-center align-middle font-medium whitespace-nowrap",
  ),
  body: cn(border, "px-2 py-1 align-top"),
};

/** 시트 바깥 틀 (글꼴·크기·색). 인쇄와 편집이 같은 모양을 유지한다 */
export const sheetFrameClassName =
  "flex flex-1 flex-col font-sans text-[11px] leading-snug text-black";
