import type { ReactNode } from "react";
import { fieldOf, repeatKey, repeatRows } from "@/shared/lib/template";
import { cn } from "@/shared/lib/utils";
import {
  DetailTable,
  PersonTable,
  type PersonTableRow,
  SealMark,
  sheetCellClass,
  sheetFrameClassName,
  type SheetProps,
} from "@/shared/ui";
import {
  MARITAL_LABELS as L,
  MARITAL_REPEATS,
  MARITAL_TEMPLATE,
  MK,
} from "./marital.model";

const { head, body } = sheetCellClass;
type Cell = (key: string) => ReactNode;

/** 혼인사항 행들(배우자). 구분(配偶者)도 모델이 읽은 값이라 칸으로 */
function spouseRows(doc: SheetProps["doc"], cell: Cell): PersonTableRow[] {
  const g = MARITAL_REPEATS.spouse.key;
  return repeatRows(MARITAL_REPEATS.spouse, doc).map((i) => ({
    relation: cell(repeatKey(g, i, "relation")),
    keys: ["name", "birthDate", "residentNumber", "gender", "origin"].map(
      (sub) => repeatKey(g, i, sub),
    ),
  }));
}

/**
 * 혼인관계증명서(상세) 일본어 양식. 일본 시약소 제출용 번역본 양식(1쪽)을 그대로 따른다
 */
export function MaritalSheet({
  doc,
  cell: renderCell,
  value,
  footer,
  className,
}: SheetProps) {
  const cell: Cell = (key) => renderCell(fieldOf(MARITAL_TEMPLATE, key));

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
              <td className={body}>{cell(MK.registryBase)}</td>
            </tr>
          </tbody>
        </table>

        <PersonTable
          className="mt-3"
          headings={L.personHead}
          cell={cell}
          rows={[
            {
              relation: L.self,
              keys: [
                MK.personName,
                MK.personBirthDate,
                MK.personResidentNumber,
                MK.personGender,
                MK.personOrigin,
              ],
            },
          ]}
        />

        <div className="mt-4 w-fit border border-black px-3 py-1">
          {L.marital}
        </div>
        <PersonTable
          className="mt-3"
          headings={L.personHead}
          cell={cell}
          rows={spouseRows(doc, cell)}
          emptyText={L.empty}
        />
        <DetailTable
          className="mt-3"
          doc={doc}
          group={MARITAL_REPEATS.history}
          headings={[L.category, L.detail]}
          cell={cell}
          value={value}
          emptyText={L.empty}
        />

        <p className="mt-6 text-center">{L.statement}</p>
        <div className="mt-4 flex justify-center">
          <div className="w-[9rem] text-center">{cell(MK.certifiedAt)}</div>
        </div>
        <div className="mt-2 flex items-center justify-end gap-3 pr-12 text-[13px] font-semibold whitespace-nowrap">
          <div className="[&>input]:w-[11rem]">{cell(MK.issuerTitle)}</div>
          <div className="[&>input]:w-[7rem]">{cell(MK.issuerName)}</div>
        </div>
        <p className="mt-6">{L.note}</p>

        <div className="mt-8 ml-auto flex w-[17rem] flex-col gap-1">
          {[
            [L.issuedTime, MK.issuedTime],
            [L.officer, MK.issuerOfficer],
            [L.phone, MK.issuerPhone],
            [L.applicant, MK.applicant],
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
              {cell(MK.stampSerial)}
              {cell(MK.stampOffice)}
              {cell(MK.stampAmount)}
              {cell(MK.stampDate)}
              {cell(MK.stampCode)}
            </div>
            <div className="text-ink-600 flex items-center gap-1 text-[8px]">
              <span>{L.stampIssuedTime}：</span>
              <div className="w-[6rem]">{cell(MK.stampIssuedTime)}</div>
            </div>
          </div>
          <div className="flex-1 pb-6 text-center text-[20px] font-medium tracking-wider">
            {cell(MK.issuerTitle)}
          </div>
          <SealMark label={L.seal} className="mb-6 h-16 text-[18px]" />
        </div>
        <p className="mt-1 text-center text-[10px]">{L.noStampNote}</p>

        <div className="pt-6 text-[9px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              {L.issueNumber} ：
              <span className="inline-block w-[12rem]">
                {cell(MK.issueNumber)}
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
