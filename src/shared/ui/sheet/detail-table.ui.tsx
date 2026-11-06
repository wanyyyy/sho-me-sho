import type { ReactNode } from "react";
import {
  type RepeatGroup,
  repeatKey,
  repeatRows,
  type TemplateDocument,
} from "@/shared/lib/template";
import { cn } from "@/shared/lib/utils";
import { sheetCellClass } from "./sheet.lib";

const { head, body } = sheetCellClass;

type DetailTableProps = {
  doc: TemplateDocument;
  /** category · label · value 세 열을 가진 가변 행 그룹 */
  group: RepeatGroup;
  /** 머릿글 [区分, 詳細内容] */
  headings: readonly [string, string];
  cell: (key: string) => ReactNode;
  value: (key: string) => string;
  /** 행이 없을 때 한 줄로 보여 줄 문구 */
  emptyText?: string;
  className?: string;
};

/** 같은 구분이 이어지는 행을 묶는다. 묶음의 첫 행에만 rowSpan, 나머지는 0 */
function categorySpans(
  value: DetailTableProps["value"],
  group: RepeatGroup,
  rows: number[],
) {
  const spans: number[] = [];
  let start = 0;
  rows.forEach((i, idx) => {
    const same =
      idx > 0 &&
      value(repeatKey(group.key, i, "category")) ===
        value(repeatKey(group.key, rows[idx - 1], "category"));
    if (same) {
      spans[start] += 1;
      spans.push(0);
    } else {
      start = idx;
      spans.push(1);
    }
  });
  return spans;
}

/**
 * 가족관계등록부 증명서 공통 [区分 | 詳細内容] 표.
 * 대괄호 [항목] 줄 하나가 행 하나, 같은 구분은 세로로 묶어 표시
 */
export function DetailTable({
  doc,
  group,
  headings,
  cell,
  value,
  emptyText,
  className,
}: DetailTableProps) {
  const rows = repeatRows(group, doc);
  const spans = categorySpans(value, group, rows);
  return (
    <table className={cn("w-full border-collapse", className)}>
      <thead>
        <tr>
          <th className={cn(head, "w-[7rem]")}>{headings[0]}</th>
          <th className={head}>{headings[1]}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((i, idx) => (
          <tr key={i}>
            {spans[idx] > 0 && (
              <td className={cn(body, "text-center")} rowSpan={spans[idx]}>
                {cell(repeatKey(group.key, i, "category"))}
              </td>
            )}
            <td className={body}>
              <div className="flex items-start gap-1">
                <span>[</span>
                {/* 인쇄(텍스트)는 내용 폭만큼, 편집(input)만 고정 폭 */}
                <div className="shrink-0 whitespace-nowrap [&>input]:w-[10rem]">
                  {cell(repeatKey(group.key, i, "label"))}
                </div>
                <span>]</span>
                <div className="min-w-0 flex-1">
                  {cell(repeatKey(group.key, i, "value"))}
                </div>
              </div>
            </td>
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td className={cn(body, "h-7 text-center")} colSpan={2}>
              {emptyText}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
