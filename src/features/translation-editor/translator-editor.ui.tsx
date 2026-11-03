import {
  TranslatorBlock,
  useTranslatorInfo,
  useTranslatorStore,
} from "@/entities/certificate";

/** 양식 아래 번역자 정보 입력 */
export function TranslatorEditor() {
  const info = useTranslatorInfo();
  const update = useTranslatorStore((s) => s.update);
  return <TranslatorBlock info={info} onChange={update} />;
}
