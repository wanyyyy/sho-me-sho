/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  /** 접근 코드 SHA-256 해시 (비어 있으면 게이트 없음). scripts/access-hash.mjs 로 생성 */
  readonly VITE_ACCESS_CODE_HASH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
