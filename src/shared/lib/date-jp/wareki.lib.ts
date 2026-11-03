/** 일본 연호(和暦) → 서기 변환 */
const ERAS: Record<string, number> = {
  令和: 2018, // 令和1年 = 2019
  平成: 1988,
  昭和: 1925,
  大正: 1911,
  明治: 1867,
};

const WAREKI_RE =
  /(令和|平成|昭和|大正|明治)\s*(元|\d{1,2})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/;
const SEIREKI_RE = /(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/;

export type YmdDate = { year: number; month: number; day: number };

/** 전각 숫자(０-９) → 반각 */
export function normalizeDigits(text: string): string {
  return text.replace(/[０-９]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
  );
}

/** "令和8年10月2日" / "令和８年１０月２日" / "西暦1992年2月20日" → {y, m, d}. 인식 실패 시 null */
export function parseJapaneseDate(text: string): YmdDate | null {
  const normalized = normalizeDigits(text);
  const w = WAREKI_RE.exec(normalized);
  if (w) {
    const [, era, y, m, d] = w;
    const year = ERAS[era] + (y === "元" ? 1 : Number(y));
    return { year, month: Number(m), day: Number(d) };
  }
  const s = SEIREKI_RE.exec(normalized);
  if (s) {
    const [, y, m, d] = s;
    return { year: Number(y), month: Number(m), day: Number(d) };
  }
  return null;
}

/** {2025, 9, 6} → "2025년 9월 6일" */
export function formatKoreanDate({ year, month, day }: YmdDate): string {
  return `${year}년 ${month}월 ${day}일`;
}

/** "令和7年9月6日" → "2025년 9월 6일". 인식 실패 시 원문 그대로 */
export function toKoreanDate(text: string): string {
  const parsed = parseJapaneseDate(text);
  return parsed ? formatKoreanDate(parsed) : text;
}
