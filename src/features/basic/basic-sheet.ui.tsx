import type { ReactNode } from "react";
import { fieldOf } from "@/shared/lib/template";
import { cn } from "@/shared/lib/utils";
import {
  DetailTable,
  PersonTable,
  SealMark,
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
  const detailHead = [L.category, L.detail] as const;

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
          className="mt-3"
          doc={doc}
          group={BASIC_REPEATS.history}
          headings={detailHead}
          cell={cell}
          value={value}
        />

        <PersonTable
          className="mt-3"
          headings={L.personHead}
          cell={cell}
          rows={[
            {
              relation: L.self,
              keys: [
                BK.personName,
                BK.personBirthDate,
                BK.personResidentNumber,
                BK.personGender,
                BK.personOrigin,
              ],
            },
          ]}
        />

        <div className="mt-4 w-fit border border-black px-3 py-1">
          {L.general}
        </div>
        <DetailTable
          className="mt-3"
          doc={doc}
          group={BASIC_REPEATS.general}
          headings={detailHead}
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
          <SealMark label={L.seal} className="mb-6 h-16 text-[18px]" />
        </div>
        <p className="mt-1 text-center text-[10px]">{L.noStampNote}</p>
        <PageFoot n={2} cell={cell} />
        {footer && <div className="mt-6">{footer}</div>}
      </section>
    </div>
  );
}
