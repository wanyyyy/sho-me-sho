import type { ExtractionResult } from "../../src/entities/certificate/certificate.types";
import { sampleEngine } from "./engines/sample";

/** 서버가 모델에 넘기는 입력. 클라이언트가 이미 JPEG 한 장으로 만들어 보낸다 */
export type ImageInput = {
  bytes: Uint8Array;
  mimeType: string;
  name: string;
};

/** 비용 로그용. 모델이 돌려주는 값만 기록하고 내용은 남기지 않는다 */
export type EngineUsage = {
  inputTokens?: number;
  outputTokens?: number;
};

export type EngineOutput = {
  result: ExtractionResult;
  usage?: EngineUsage;
};

/** 서버 쪽 읽기·번역 엔진. 모델을 정하면 이 인터페이스로 하나 더 만들어 ENGINES 에 등록한다 */
export interface ServerExtractor {
  readonly name: string;
  extract(image: ImageInput): Promise<EngineOutput>;
}

const ENGINES: Record<string, ServerExtractor> = {
  sample: sampleEngine,
};

export const DEFAULT_ENGINE = "sample";

/** EXTRACT_ENGINE 환경변수로 엔진을 고른다. 모르는 이름이면 바로 실패시켜 조용히 샘플로 빠지지 않게 한다 */
export function selectEngine(
  name: string = process.env.EXTRACT_ENGINE ?? DEFAULT_ENGINE,
): ServerExtractor {
  const engine = ENGINES[name];
  if (!engine) {
    throw new Error(
      `알 수 없는 엔진 "${name}". 가능한 값: ${Object.keys(ENGINES).join(", ")}`,
    );
  }
  return engine;
}
