import type { ReactNode } from "react";
import {
  fieldOf,
  repeatKey,
  repeatRows,
  type TemplateDocument,
} from "@/shared/lib/template";
import { cn } from "@/shared/lib/utils";
import {
  SealMark,
  sheetCellClass,
  sheetFrameClassName,
  type SheetProps,
} from "@/shared/ui";
import {
  FAMILY_LABELS as L,
  FAMILY_REPEAT,
  FAMILY_TEMPLATE,
  FK,
} from "./family.model";

const { head, body } = sheetCellClass;
type Cell = (key: string) => ReactNode;

/** 사람 한 줄: 区分 · 氏名 · 出生年月日 · 住民登録番号 · 性別 · 本籍 */
type PersonRow = { relation: ReactNode; keys: string[] };

/** [区分 | 氏名 | …] 표. 본인 표와 가족사항 표가 같은 모양 */
function PersonTable({ rows, cell }: { rows: PersonRow[]; cell: Cell }) {
  const widths = ["w-[11rem]", "w-[8.5rem]", "w-[8rem]", "w-[3rem]", ""];
  return (
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
        {rows.map(({ relation, keys }, idx) => (
          <tr key={idx}>
            <td className={cn(body, "w-[3rem] text-center")}>{relation}</td>
            {keys.map((key, col) => (
              <td
                key={key}
                className={cn(body, widths[col], col >= 3 && "text-center")}
              >
                {cell(key)}
              </td>
            ))}
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td className={cn(body, "h-7")} colSpan={6} />
          </tr>
        )}
      </tbody>
    </table>
  );
}

/** 가족사항 행들. 구분(父·母…)도 모델이 읽은 값이라 칸으로 */
function familyRows(doc: TemplateDocument, cell: Cell): PersonRow[] {
  const g = FAMILY_REPEAT.key;
  return repeatRows(FAMILY_REPEAT, doc).map((i) => ({
    relation: cell(repeatKey(g, i, "relation")),
    keys: ["name", "birthDate", "residentNumber", "gender", "origin"].map(
      (sub) => repeatKey(g, i, sub),
    ),
  }));
}

/**
 * 가족관계증명서(상세) 일본어 양식. 일본 시약소 제출용 번역본 양식(1쪽)을 그대로 따른다
 */
export function FamilySheet({
  doc,
  cell: renderCell,
  footer,
  className,
}: SheetProps) {
  const cell: Cell = (key) => renderCell(fieldOf(FAMILY_TEMPLATE, key));

  return (
    <div className={cn(sheetFrameClassName, className)}>
      <section className="flex min-h-[273mm] flex-col print:min-h-[265mm]">
        <h1 className="mb-5 text-center text-lg font-semibold tracking-[0.3em]">
          {L.title}
        </h1>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <th className={cn(head, "w-[7rem]")}>{L.registryBase}</th>
              <td className={body}>{cell(FK.registryBase)}</td>
            </tr>
          </tbody>
        </table>

        <PersonTable
          cell={cell}
          rows={[
            {
              relation: L.self,
              keys: [
                FK.personName,
                FK.personBirthDate,
                FK.personResidentNumber,
                FK.personGender,
                FK.personOrigin,
              ],
            },
          ]}
        />

        <div className="mt-4 w-fit border border-black px-3 py-1">
          {L.family}
        </div>
        <PersonTable cell={cell} rows={familyRows(doc, cell)} />

        <p className="mt-6 text-center">{L.statement}</p>
        <div className="mt-4 flex justify-center">
          <div className="w-[9rem] text-center">{cell(FK.certifiedAt)}</div>
        </div>
        <div className="mt-2 flex items-center justify-end gap-3 pr-12 text-[13px] font-semibold whitespace-nowrap">
          <div className="[&>input]:w-[11rem]">{cell(FK.issuerTitle)}</div>
          <div className="[&>input]:w-[7rem]">{cell(FK.issuerName)}</div>
        </div>
        <p className="mt-6">{L.note}</p>

        <div className="mt-8 ml-auto flex w-[17rem] flex-col gap-1">
          {[
            [L.issuedTime, FK.issuedTime],
            [L.officer, FK.issuerOfficer],
            [L.phone, FK.issuerPhone],
            [L.applicant, FK.applicant],
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
              {cell(FK.stampSerial)}
              {cell(FK.stampOffice)}
              {cell(FK.stampAmount)}
              {cell(FK.stampDate)}
              {cell(FK.stampCode)}
            </div>
            <div className="text-ink-600 flex items-center gap-1 text-[8px]">
              <span>{L.stampIssuedTime}：</span>
              <div className="w-[6rem]">{cell(FK.stampIssuedTime)}</div>
            </div>
          </div>
          <div className="flex-1 pb-6 text-center text-[20px] font-medium tracking-wider">
            {cell(FK.issuerTitle)}
          </div>
          <SealMark label={L.seal} className="mb-6 h-16 text-[18px]" />
        </div>
        <p className="mt-1 text-center text-[10px]">{L.noStampNote}</p>

        <div className="pt-6 text-[9px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              {L.issueNumber} ：
              <span className="inline-block w-[12rem]">
                {cell(FK.issueNumber)}
              </span>
            </span>
            <span>{L.pageOf}</span>
          </div>
          <p className="mt-1">{L.footnote}</p>
        </div>
        {footer && <div className="mt-6">{footer}</div>}
      </section>
    </div>
  );
}
