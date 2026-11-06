import type { YmdDate } from "./wareki.lib";

const KOREAN_DATE_RE = /(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일/;

/** "1992년 02월 20일" → {1992, 2, 20}. 인식 실패 시 null */
export function parseKoreanDate(text: string): YmdDate | null {
  const m = KOREAN_DATE_RE.exec(text);
  if (!m) return null;
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
}

/** {2026, 1, 10} → "2026年 1月 10日" (번역 확인서의 오늘 날짜용) */
export function formatJapaneseDate({ year, month, day }: YmdDate): string {
  return `${year}年 ${month}月 ${day}日`;
}

/**
 * "1992년 02월 20일" → "1992年 02月 20日". 한국 공문서의 자릿수(02월)를 그대로 지켜
 * 양식과 같은 모양으로 만든다. 날짜가 아니면 원문 그대로
 */
export function toJapaneseDate(text: string): string {
  return text.replace(KOREAN_DATE_RE, "$1年 $2月 $3日");
}
