/**
 * 접근 코드의 SHA-256 해시. 비어 있으면 게이트를 끈다.
 * 값 만들기: pnpm access:hash <코드>  → .env.local 의 VITE_ACCESS_CODE_HASH 에 붙여 넣기
 */
export const ACCESS_CODE_HASH: string =
  import.meta.env.VITE_ACCESS_CODE_HASH?.trim().toLowerCase() ?? "";
