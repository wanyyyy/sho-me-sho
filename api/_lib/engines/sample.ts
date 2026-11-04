import { SAMPLE_EXTRACTION } from "../../../src/entities/certificate/certificate.mock";
import type { ServerExtractor } from "../engine";

const DELAY_MS = 600;

/** 모델을 정하기 전까지 쓰는 엔진. 이미지 내용과 무관하게 샘플을 돌려준다 */
export const sampleEngine: ServerExtractor = {
  name: "sample",
  async extract() {
    await new Promise((r) => setTimeout(r, DELAY_MS));
    return { result: SAMPLE_EXTRACTION };
  },
};
