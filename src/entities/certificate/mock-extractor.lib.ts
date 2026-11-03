import { SAMPLE_EXTRACTION } from "./certificate.mock";
import { ExtractionResult, Extractor } from "./certificate.types";

const DELAY_MS = 900;

/** 모델 호출 자리를 채우는 가짜 엔진. 파일 내용과 무관하게 샘플을 돌려준다 */
export const mockExtractor: Extractor = {
  async extract(_file: File): Promise<ExtractionResult> {
    await new Promise((r) => setTimeout(r, DELAY_MS));
    return SAMPLE_EXTRACTION;
  },
};
