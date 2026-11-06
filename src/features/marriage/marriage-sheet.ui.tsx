import { cn } from "@/shared/lib/utils";
import {
  sheetCellClass,
  sheetFrameClassName,
  type SheetProps,
} from "@/shared/ui";
import {
  K,
  MARRIAGE_FIELD_MAP,
  NOTIFIER_ROWS,
  PERSON_ROWS,
  SHEET_LABELS,
  SUMMARY_ROWS,
} from "./marriage.model";

/** 원본의 공인(公印) 자리. 붉은 사각 테두리 안에 "직인" — 번역본임을 나타내는 표시이며 실제 도장을 대신하지 않는다 */
function SealMark() {
  return (
    <span
      aria-label={SHEET_LABELS.seal}
      className="border-danger-500 text-danger-500 inline-flex h-11 w-11 shrink-0 items-center justify-center border-[2.5px] text-[13px] leading-none font-bold tracking-[0.2em] [print-color-adjust:exact]"
    >
      {SHEET_LABELS.seal}
    </span>
  );
}

const { head, body } = sheetCellClass;

/**
 * 수리증명서 한국어 양식. 원본(受理証明書)의 표 구조를 그대로 따른다.
 * 머릿글·항목명·고정 문구는 여기 고정, 값은 cell() 로 받는다.
 */
export function MarriageSheet({
  cell: renderCell,
  value,
  footer,
  className,
}: SheetProps) {
  const cell = (key: string) => renderCell(MARRIAGE_FIELD_MAP[key]);
  return (
    <div className={cn(sheetFrameClassName, className)}>
      <h1 className="mb-3 text-center text-lg font-semibold tracking-[0.4em]">
        {SHEET_LABELS.title}
      </h1>
      <table className="w-full border-collapse">
        <tbody>
          <tr>
            <th className={cn(head, "w-[2.5rem]")}>
              {SHEET_LABELS.notification}
            </th>
            <td className={body}>{cell(K.notificationType)}</td>
            <th className={cn(head, "w-[3.5rem]")}>
              {SHEET_LABELS.notifiedAt}
            </th>
            <td className={cn(body, "w-[11rem]")}>{cell(K.notifiedAt)}</td>
          </tr>
          {NOTIFIER_ROWS.map((i) => (
            <tr key={`notifier-${i}`}>
              {i === 0 && (
                <th className={head} rowSpan={NOTIFIER_ROWS.length}>
                  <span className="[writing-mode:vertical-rl]">
                    {SHEET_LABELS.notifier}
                  </span>
                </th>
              )}
              <td className={body} colSpan={3}>
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,14rem)] gap-2">
                  <div>{cell(K.notifierName(i))}</div>
                  <div className="flex items-start gap-1">
                    <span>(</span>
                    <div className="min-w-0 flex-1">
                      {cell(K.notifierNote(i))}
                    </div>
                    <span>)</span>
                  </div>
                </div>
              </td>
            </tr>
          ))}
          {PERSON_ROWS.map((i) => (
            <tr key={`person-${i}`}>
              {i === 0 && (
                <th className={head} rowSpan={PERSON_ROWS.length}>
                  <span className="tracking-[0.5em] [writing-mode:vertical-rl]">
                    {SHEET_LABELS.person}
                  </span>
                </th>
              )}
              <td className={cn(body, "min-h-[3.6rem]")} colSpan={3}>
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,14rem)] gap-x-2 gap-y-0.5">
                  <div className="text-[9px]">{cell(K.personKana(i))}</div>
                  <div />
                  <div>{cell(K.personName(i))}</div>
                  <div className="flex items-start gap-1">
                    <span>(</span>
                    <div className="min-w-0 flex-1 text-center">
                      {cell(K.personRelation(i))}
                    </div>
                    <span>)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-[4.5rem] shrink-0">
                      {cell(K.personRegistryLabel(i))}
                    </div>
                    <div className="min-w-0 flex-1">
                      {cell(K.personRegistry(i))}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="shrink-0">{SHEET_LABELS.birthDate}</span>
                    <div className="min-w-0 flex-1">
                      {cell(K.personBirthDate(i))}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
          <tr>
            <th className={head}>
              <span className="[writing-mode:vertical-rl]">
                {SHEET_LABELS.summary}
              </span>
            </th>
            <td className={body} colSpan={3}>
              {SUMMARY_ROWS.map((i) => (
                <div key={`summary-${i}`} className="flex items-start gap-1">
                  <span>【</span>
                  <div className="w-[6rem] shrink-0">
                    {cell(K.summaryLabel(i))}
                  </div>
                  <span>】</span>
                  <div className="min-w-0 flex-1">
                    {cell(K.summaryValue(i))}
                  </div>
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-1 flex items-center gap-2 text-[9px]">
        <span>{SHEET_LABELS.issueNumber}:</span>
        <div className="w-[10rem]">{cell(K.issueNumber)}</div>
      </div>
      <p className="mt-2 pl-4">{SHEET_LABELS.statement(value(K.acceptedAt))}</p>
      <div className="mt-3 flex items-start gap-2 pl-10">
        <div className="w-[10rem]">{cell(K.issuedAt)}</div>
      </div>
      <div className="mt-2 flex items-end justify-end gap-4 pr-6">
        <div className="w-[12rem]">{cell(K.issuerTitle)}</div>
        <div className="w-[8rem] text-base tracking-[0.3em]">
          {cell(K.issuerName)}
        </div>
        <SealMark />
      </div>
      {/* 용지 높이가 남으면 맨 아래에 붙는다 */}
      {footer && <div className="mt-auto pt-6">{footer}</div>}
    </div>
  );
}
