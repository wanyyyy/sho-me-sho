import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { sheetCellClass } from "./sheet.lib";

const { head, body } = sheetCellClass;

/** 사람 한 줄. relation 은 고정 문구(本人)나 칸, keys 는 머릿글 2열째부터의 칸 키 */
export type PersonTableRow = { relation: ReactNode; keys: string[] };

type PersonTableProps = {
  /** 머릿글 (区分 · 氏名 · 出生年月日 · 住民登録番号 · 性別 · 本籍) */
  headings: readonly string[];
  rows: PersonTableRow[];
  cell: (key: string) => ReactNode;
  /** 행이 없을 때 한 줄로 보여 줄 문구 (예: 記録する事項がありません。) */
  emptyText?: string;
  className?: string;
};

const WIDTHS = ["w-[11rem]", "w-[8.5rem]", "w-[8rem]", "w-[3rem]", ""];

/** 가족관계등록부 증명서 공통 [区分 | 氏名 | 出生年月日 | 住民登録番号 | 性別 | 本籍] 표 */
export function PersonTable({
  headings,
  rows,
  cell,
  emptyText,
  className,
}: PersonTableProps) {
  return (
    <table className={cn("w-full border-collapse", className)}>
      <thead>
        <tr>
          {headings.map((h) => (
            <th key={h} className={head}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(({ relation, keys }, idx) => (
          <tr key={idx}>
            <td className={cn(body, "w-[3rem] text-center")}>{relation}</td>
            {keys.map((key, col) => (
              <td
                key={key}
                className={cn(body, WIDTHS[col], col >= 3 && "text-center")}
              >
                {cell(key)}
              </td>
            ))}
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td
              className={cn(body, "h-7 text-center")}
              colSpan={headings.length}
            >
              {emptyText}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
