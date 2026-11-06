import { SAMPLES } from "../documents.ts";
import type { ServerExtractor } from "../engine.ts";

const DELAY_MS = 600;

/** 모델 없이 쓰는 엔진. 이미지 내용과 무관하게 서류 종류의 샘플을 돌려준다 */
export const sampleEngine: ServerExtractor = {
  name: "sample",
  async extract(_images, template) {
    await new Promise((r) => setTimeout(r, DELAY_MS));
    return { result: SAMPLES[template.type] };
  },
};
