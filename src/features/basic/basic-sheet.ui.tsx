import type { ReactNode } from "react";
import {
  fieldOf,
  type RepeatGroup,
  repeatKey,
  repeatRows,
  type TemplateDocument,
} from "@/shared/lib/template";
import { cn } from "@/shared/lib/utils";
import {
  sheetCellClass,
  sheetFrameClassName,
  type SheetProps,
} from "@/shared/ui";
import {
  BASIC_LABELS as L,
  BASIC_REPEATS,
  BASIC_TEMPLATE,
  BK,
} from "./basic.model";

const { head, body } = sheetCellClass;
type Cell = (key: string) => ReactNode;
type Value = (key: string) => string;

/** 같은 구분이 이어지는 행을 묶는다. 묶음의 첫 행에만 rowSpan, 나머지는 0 */
function categorySpans(value: Value, group: RepeatGroup, rows: number[]) {
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

/** [区分 | 詳細内容] 표. 대괄호 줄 하나가 행 하나, 구분은 묶어서 표시 */
function DetailTable({
  doc,
  group,
  cell,
  value,
}: {
  doc: TemplateDocument;
  group: RepeatGroup;
  cell: Cell;
  value: Value;
}) {
  const rows = repeatRows(group, doc);
  const spans = categorySpans(value, group, rows);
  return (
    <table className="mt-3 w-full border-collapse">
      <thead>
        <tr>
          <th className={cn(head, "w-[7rem]")}>{L.category}</th>
          <th className={head}>{L.detail}</th>
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
            <td className={cn(body, "h-7")} colSpan={2} />
          </tr>
        )}
      </tbody>
    </table>
  );
}

/** 쪽 맨 아래: 発給番号 · 쪽수 · 진위확인 안내 */
function PageFoot({ n, cell }: { n: number; cell: Cell }) {
  return (
    <div className="mt-auto pt-6 text-[9px]">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1">
          {L.issueNumber} ：
          <span className="inline-block w-[12rem]">{cell(BK.issueNumber)}</span>
        </span>
        <span>{L.pageOf(n)}</span>
      </div>
      <p className="mt-1">{L.footnote}</p>
    </div>
  );
}

/**
 * 기본증명서(상세) 일본어 양식. 일본 시약소 제출용 번역본 양식(2쪽)을 그대로 따른다.
 * 화면에서는 한 장에 1·2쪽을 이어 보여 주고, 인쇄할 때 2쪽에서 장을 넘긴다
 */
export function BasicSheet({
  doc,
  cell: renderCell,
  value,
  footer,
  className,
}: SheetProps) {
  const cell: Cell = (key) => renderCell(fieldOf(BASIC_TEMPLATE, key));
  const page = "flex min-h-[273mm] flex-col print:min-h-[265mm]";

  return (
    <div className={cn(sheetFrameClassName, className)}>
      <section className={cn(page, "print:break-after-page")}>
        <h1 className="mb-5 text-center text-lg font-semibold tracking-[0.3em]">
          {L.title}
        </h1>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <th className={cn(head, "w-[7rem]")}>{L.registryBase}</th>
              <td className={body}>{cell(BK.registryBase)}</td>
            </tr>
          </tbody>
        </table>

        <DetailTable
          doc={doc}
          group={BASIC_REPEATS.history}
          cell={cell}
          value={value}
        />

        <table className="mt-3 w-full border-collapse">
          <thead>
            <tr>
              {L.personHead.map((h) => (
                <th key={h} className={head}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={cn(body, "w-[3rem] text-center")}>{L.self}</td>
              <td className={cn(body, "w-[11rem]")}>{cell(BK.personName)}</td>
              <td className={cn(body, "w-[8.5rem]")}>
                {cell(BK.personBirthDate)}
              </td>
              <td className={cn(body, "w-[8rem]")}>
                {cell(BK.personResidentNumber)}
              </td>
              <td className={cn(body, "w-[3rem] text-center")}>
                {cell(BK.personGender)}
              </td>
              <td className={cn(body, "text-center")}>
                {cell(BK.personOrigin)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 w-fit border border-black px-3 py-1">
          {L.general}
        </div>
        <DetailTable
          doc={doc}
          group={BASIC_REPEATS.general}
          cell={cell}
          value={value}
        />

        <p className="mt-6 text-center">{L.statement}</p>
        <div className="mt-4 flex justify-center">
          <div className="w-[9rem] text-center">{cell(BK.certifiedAt)}</div>
        </div>
        <div className="mt-2 flex items-center justify-end gap-3 pr-12 text-[13px] font-semibold whitespace-nowrap">
          <div className="[&>input]:w-[11rem]">{cell(BK.issuerTitle)}</div>
          <div className="[&>input]:w-[7rem]">{cell(BK.issuerName)}</div>
        </div>
        <p className="mt-6">{L.note}</p>
        <PageFoot n={1} cell={cell} />
      </section>

      <section
        className={cn(
          page,
          "border-ink-400 mt-8 border-t border-dashed pt-8 print:mt-0 print:border-0 print:pt-0",
        )}
      >
        <div className="ml-auto flex w-[17rem] flex-col gap-1">
          {[
            [L.issuedTime, BK.issuedTime],
            [L.officer, BK.issuerOfficer],
            [L.phone, BK.issuerPhone],
            [L.applicant, BK.applicant],
          ].map(([label, key]) => (
            <div key={key} className="flex items-center gap-1">
              <span className="w-[5rem] shrink-0">{label}：</span>
              <div className="min-w-0 flex-1">{cell(key)}</div>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 pt-10">
          <div className="flex flex-col gap-1">
            <div className="border-ink-400 text-ink-600 flex w-[9rem] flex-col gap-0.5 rounded-xl border-[3px] px-3 py-2 text-center text-[10px] font-semibold">
              {cell(BK.stampSerial)}
              {cell(BK.stampOffice)}
              {cell(BK.stampAmount)}
              {cell(BK.stampDate)}
              {cell(BK.stampCode)}
            </div>
            <div className="text-ink-600 flex items-center gap-1 text-[8px]">
              <span>{L.stampIssuedTime}：</span>
              <div className="w-[6rem]">{cell(BK.stampIssuedTime)}</div>
            </div>
          </div>
          <div className="flex-1 pb-6 text-center text-[20px] font-medium tracking-wider">
            {cell(BK.issuerTitle)}
          </div>
          <div className="border-danger-500 text-danger-500 mb-6 flex w-[7rem] flex-col items-center gap-0.5 border-2 px-1 py-2 text-center text-[9px] font-semibold [print-color-adjust:exact]">
            {cell(BK.sealLine1)}
            {cell(BK.sealLine2)}
          </div>
        </div>
        <p className="mt-1 text-center text-[10px]">{L.noStampNote}</p>
        <PageFoot n={2} cell={cell} />
        {footer && <div className="mt-6">{footer}</div>}
      </section>
    </div>
  );
}
