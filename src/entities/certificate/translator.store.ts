import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { formatKoreanDate } from "@/shared/lib/date-jp";

export const TRANSLATOR_RELATIONS = [
  { value: "self", label: "본인" },
  { value: "family", label: "가족" },
  { value: "agent", label: "번역 대행자" },
] as const;

export type TranslatorRelation = (typeof TRANSLATOR_RELATIONS)[number]["value"];

export type TranslatorInfo = {
  /** 번역일 (양식에 그대로 찍히는 문자열) */
  translatedAt: string;
  name: string;
  relation: TranslatorRelation;
};

type TranslatorState = TranslatorInfo & {
  update: (patch: Partial<TranslatorInfo>) => void;
};

function todayKorean(date = new Date()): string {
  return formatKoreanDate({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  });
}

/** 번역자 정보. 브라우저에 저장하지 않고 탭을 닫으면 사라진다 */
export const useTranslatorStore = create<TranslatorState>()((set) => ({
  translatedAt: todayKorean(),
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
