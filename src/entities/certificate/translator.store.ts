import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { formatJapaneseDate, formatKoreanDate } from "@/shared/lib/date-jp";
import type { Lang } from "@/shared/lib/template";

export const TRANSLATOR_RELATIONS = [
  { value: "self", label: { ko: "본인", ja: "本人" } },
  { value: "family", label: { ko: "가족", ja: "家族" } },
  { value: "agent", label: { ko: "번역 대행자", ja: "翻訳代行者" } },
] as const;

export type TranslatorRelation = (typeof TRANSLATOR_RELATIONS)[number]["value"];

export type TranslatorInfo = {
  /** 번역일. 비어 있으면 양식 언어로 오늘 날짜를 찍는다 */
  translatedAt: string;
  name: string;
  relation: TranslatorRelation;
};

type TranslatorState = TranslatorInfo & {
  update: (patch: Partial<TranslatorInfo>) => void;
};

/** 오늘 날짜를 양식 언어로 */
export function todayText(lang: Lang, date = new Date()): string {
  const ymd = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
  return lang === "ja" ? formatJapaneseDate(ymd) : formatKoreanDate(ymd);
}

/** 번역자 정보. 브라우저에 저장하지 않고 탭을 닫으면 사라진다 */
export const useTranslatorStore = create<TranslatorState>()((set) => ({
  translatedAt: "",
  name: "",
  relation: "self",
  update: (patch) => set(patch),
}));

/** 객체를 돌려주는 셀렉터는 useShallow 로 감싸야 매 렌더마다 새 객체로 간주되지 않는다 */
export const useTranslatorInfo = (): TranslatorInfo =>
  useTranslatorStore(
    useShallow((s) => ({
      translatedAt: s.translatedAt,
      name: s.name,
      relation: s.relation,
    })),
  );
