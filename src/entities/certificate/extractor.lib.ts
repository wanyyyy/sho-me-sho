import { EXTRACTOR_NAME } from "@/shared/env";
import { Extractor } from "./certificate.types";
import { mockExtractor } from "./mock-extractor.lib";
import { remoteExtractor } from "./remote-extractor.lib";

/** 엔진 선택 지점. remote 는 서버 함수(/api/extract), mock 은 브라우저 안 샘플 */
export const extractor: Extractor =
  EXTRACTOR_NAME === "remote" ? remoteExtractor : mockExtractor;
