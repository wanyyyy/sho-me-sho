import { cn } from "@/shared/lib/utils";
import { sheetInputClassName } from "./certificate-sheet.ui";
import {
  TRANSLATOR_RELATIONS,
  TranslatorInfo,
  TranslatorRelation,
} from "./translator.store";

export const TRANSLATOR_LABELS = {
  title: "【 번역 확인서 (제출용) 】",
  translatedAt: "번역일",
  name: "번역자 성명",
  relation: "본인과의 관계",
} as const;

type TranslatorBlockProps = {
  info: TranslatorInfo;
  /** 있으면 편집 모드(입력·선택), 없으면 인쇄용 텍스트 */
  onChange?: (patch: Partial<TranslatorInfo>) => void;
  className?: string;
};

const inputClass = cn(sheetInputClassName, "border-paper-200 w-[10rem]");

/** 양식 맨 아래 번역자 정보. 관계는 [ V ] 체크 표기 */
export function TranslatorBlock({
  info,
  onChange,
  className,
}: TranslatorBlockProps) {
  const row = "flex items-center gap-2";
  const label = "w-[6.5rem] shrink-0";

  return (
    <section
      aria-label="번역 확인서"
      className={cn("flex flex-col gap-1 text-[11px] text-black", className)}
    >
      <p className="font-semibold">{TRANSLATOR_LABELS.title}</p>
      <div className={row}>
        <span className={label}>{TRANSLATOR_LABELS.translatedAt}:</span>
        {onChange ? (
          <input
            aria-label={TRANSLATOR_LABELS.translatedAt}
            value={info.translatedAt}
            onChange={(e) => onChange({ translatedAt: e.target.value })}
            className={inputClass}
          />
        ) : (
          <span>{info.translatedAt}</span>
        )}
      </div>
      <div className={row}>
        <span className={label}>{TRANSLATOR_LABELS.name}:</span>
        {onChange ? (
          <input
            aria-label={TRANSLATOR_LABELS.name}
            value={info.name}
            placeholder="성명"
            onChange={(e) => onChange({ name: e.target.value })}
            className={inputClass}
          />
        ) : (
          <span>{info.name || "　　　　"}</span>
        )}
      </div>
      <div className={row}>
        <span className={label}>{TRANSLATOR_LABELS.relation}:</span>
        <div
          role={onChange ? "radiogroup" : undefined}
          aria-label={TRANSLATOR_LABELS.relation}
          className="flex flex-wrap gap-x-5 gap-y-1"
        >
          {TRANSLATOR_RELATIONS.map(({ value, label: text }) => (
            <RelationMark
              key={value}
              value={value}
              label={text}
              checked={info.relation === value}
              onSelect={onChange && (() => onChange({ relation: value }))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RelationMark({
  value,
  label,
  checked,
  onSelect,
}: {
  value: TranslatorRelation;
  label: string;
  checked: boolean;
  onSelect?: () => void;
}) {
  const mark = <span className="font-mono">[{checked ? " V " : "   "}]</span>;
  if (!onSelect)
    return (
      <span className="whitespace-pre">
        {mark} {label}
      </span>
    );
  return (
    <label className="flex cursor-pointer items-center gap-1 whitespace-pre">
      <input
        type="radio"
        name="translator-relation"
        value={value}
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />
      <span className={cn(checked && "text-accent-600 font-semibold")}>
        {mark}
      </span>{" "}
      {label}
    </label>
  );
}
