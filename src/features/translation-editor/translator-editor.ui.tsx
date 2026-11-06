import type { Lang } from "@/shared/lib/template";
import {
  TranslatorBlock,
  useTranslatorInfo,
  useTranslatorStore,
} from "@/entities/certificate";

/** 양식 아래 번역자 정보 입력. lang 은 양식 언어(= 템플릿의 번역 언어) */
export function TranslatorEditor({ lang }: { lang: Lang }) {
  const info = useTranslatorInfo();
  const update = useTranslatorStore((s) => s.update);
  return <TranslatorBlock info={info} lang={lang} onChange={update} />;
}
