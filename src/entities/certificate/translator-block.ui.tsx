import type { Lang } from "@/shared/lib/template";
import { cn } from "@/shared/lib/utils";
import { sheetInputClassName } from "@/shared/ui";
import {
  todayText,
  TRANSLATOR_RELATIONS,
  TranslatorInfo,
  TranslatorRelation,
} from "./translator.store";

/** 양식 언어별 문구. ja 는 일본 시약소 제출용 양식의 翻訳証明書 그대로 */
export const TRANSLATOR_LABELS: Record<
  Lang,
  {
    title: string;
    translatedAt: string;
    name: string;
    relation: string;
    placeholder: string;
  }
> = {
  ko: {
    title: "【 번역 확인서 (제출용) 】",
    translatedAt: "번역일",
    name: "번역자 성명",
    relation: "본인과의 관계",
    placeholder: "성명",
  },
  ja: {
    title: "【 翻訳証明書 (区役所提出用) 】",
    translatedAt: "翻訳年月日",
    name: "翻訳者氏名",
    relation: "本人との関係",
    placeholder: "氏名",
  },
};

type TranslatorBlockProps = {
  info: TranslatorInfo;
  /** 양식 언어 (= 템플릿의 번역 언어) */
  lang: Lang;
  /** 있으면 편집 모드(입력·선택), 없으면 인쇄용 텍스트 */
  onChange?: (patch: Partial<TranslatorInfo>) => void;
  className?: string;
};

const inputClass = cn(sheetInputClassName, "border-paper-200 w-[10rem]");

/** 양식 맨 아래 번역자 정보. 관계는 [ V ] 체크 표기 */
export function TranslatorBlock({
  info,
  lang,
  onChange,
  className,
}: TranslatorBlockProps) {
  const row = "flex items-center gap-2";
  const label = "w-[6.5rem] shrink-0";
  const t = TRANSLATOR_LABELS[lang];
  const translatedAt = info.translatedAt || todayText(lang);

  return (
    <section
      aria-label="번역 확인서"
      className={cn("flex flex-col gap-1 text-[11px] text-black", className)}
    >
      <p className="font-semibold">{t.title}</p>
      <div className={row}>
        <span className={label}>{t.translatedAt}:</span>
        {onChange ? (
          <input
            aria-label={t.translatedAt}
            value={translatedAt}
            onChange={(e) => onChange({ translatedAt: e.target.value })}
            className={inputClass}
          />
        ) : (
          <span>{translatedAt}</span>
        )}
      </div>
      <div className={row}>
        <span className={label}>{t.name}:</span>
        {onChange ? (
          <input
            aria-label={t.name}
            value={info.name}
            placeholder={t.placeholder}
            onChange={(e) => onChange({ name: e.target.value })}
            className={inputClass}
          />
        ) : (
          <span>{info.name || "　　　　"}</span>
        )}
      </div>
      <div className={row}>
        <span className={label}>{t.relation}:</span>
        <div
          role={onChange ? "radiogroup" : undefined}
          aria-label={t.relation}
          className="flex flex-wrap gap-x-5 gap-y-1"
        >
          {TRANSLATOR_RELATIONS.map(({ value, label: text }) => (
            <RelationMark
              key={value}
              value={value}
              label={text[lang]}
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
