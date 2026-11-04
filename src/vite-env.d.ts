/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  /** 접근 코드 SHA-256 해시 (비어 있으면 게이트 없음). scripts/access-hash.mjs 로 생성 */
  readonly VITE_ACCESS_CODE_HASH?: string;
  /** 읽기·번역 엔진: "remote"(서버 호출) | "mock"(브라우저 안 샘플). 없으면 배포=remote, 개발=mock */
  readonly VITE_EXTRACTOR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
