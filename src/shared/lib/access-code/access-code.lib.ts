const KEY = "access-code";

/**
 * 접근 코드를 탭 단위(sessionStorage)로만 둔다. 게이트 통과 표시이자
 * 서버 호출 때 같이 보내는 값. 증명서 내용과는 무관한 값이다
 */
export function readAccessCode(): string {
  try {
    return sessionStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function writeAccessCode(code: string): void {
  try {
    sessionStorage.setItem(KEY, code);
  } catch {
    // 저장 못 하면 이 탭에서 다시 입력받는다
  }
}

/** 헤더 값은 ASCII 여야 하므로 한글 코드도 안전하게 인코딩한다 */
export function accessCodeHeader(code: string = readAccessCode()): string {
  return encodeURIComponent(code);
}
