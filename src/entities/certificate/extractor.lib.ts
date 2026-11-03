import { Extractor } from "./certificate.types";
import { mockExtractor } from "./mock-extractor.lib";

/** 엔진 선택 지점. 실제 모델 연동 시 이 한 줄만 바꾼다 */
export const extractor: Extractor = mockExtractor;
