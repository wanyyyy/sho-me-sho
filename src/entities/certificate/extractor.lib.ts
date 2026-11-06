import { EXTRACTOR_NAME } from "@/shared/env";
import { remoteExtractor } from "./remote-extractor.lib";

/** 서버 엔진. mock 모드(개발 기본)에서는 서버를 부르지 않고 서류의 샘플을 연다 */
export const extractor = remoteExtractor;
export const IS_MOCK_EXTRACTOR = EXTRACTOR_NAME === "mock";
