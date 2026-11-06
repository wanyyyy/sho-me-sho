import type {
  DocumentTemplate,
  ExtractedField,
  RepeatGroup,
  TemplateDocument,
  TemplateField,
} from "./template.types";

const REPEAT_KEY_RE = /^([A-Za-z]+)\.(\d+)\.([A-Za-z]+)$/;

/** 가변 행의 평면 키 */
export const repeatKey = (group: string, index: number, sub: string) =>
  `${group}.${index}.${sub}`;

/** 키 → 칸 선언. 고정 칸은 표에서, 가변 행은 패턴에서 만든다. 모르는 키는 text */
export function fieldOf(
  template: DocumentTemplate,
  key: string,
): TemplateField {
  const fixed = template.fields.find((f) => f.key === key);
  if (fixed) return fixed;
  const m = REPEAT_KEY_RE.exec(key);
  const group = m && template.repeats.find((g) => g.key === m[1]);
  const sub = group && group.fields.find((f) => f.sub === m[3]);
  if (!group || !sub) return { key, labelKo: key, labelJa: key, kind: "text" };
  const n = Number(m[2]) + 1;
  return {
    key,
    labelKo: `${group.labelKo} ${n} ${sub.labelKo}`,
    labelJa: `${group.labelJa} ${n} ${sub.labelJa}`,
    kind: sub.kind,
  };
}

/** 문서에 들어 있는 가변 행 번호들 (모델 결과 + 수정값 기준, 오름차순) */
export function repeatRows(
  group: RepeatGroup,
  doc: TemplateDocument,
): number[] {
  const rows = new Set<number>();
  for (const key of [
    ...Object.keys(doc.extracted),
    ...Object.keys(doc.edits),
  ]) {
    const m = REPEAT_KEY_RE.exec(key);
    if (m && m[1] === group.key) rows.add(Number(m[2]));
  }
  return [...rows].sort((a, b) => a - b);
}

/** 가변 행 하나의 키 목록 (열 순서대로) */
export function repeatRowKeys(group: RepeatGroup, index: number): string[] {
  return group.fields.map((f) => repeatKey(group.key, index, f.sub));
}

/** 문서의 모든 칸 키: 고정 칸 + 가변 행 (상태 집계·검증용) */
export function documentKeys(
  template: DocumentTemplate,
  doc: TemplateDocument,
): string[] {
  return [
    ...template.fields.map((f) => f.key),
    ...template.repeats.flatMap((group) =>
      repeatRows(group, doc).flatMap((i) => repeatRowKeys(group, i)),
    ),
  ];
}

/** 샘플 데이터용 값 생성기 */
export const sampleField =
  (confidence: ExtractedField["confidence"]) =>
  (ja: string, ko: string): ExtractedField => ({ ja, ko, confidence });

/** 가변 행 하나를 평면 키 묶음으로 (샘플 데이터용) */
export function sampleRow(
  group: string,
  index: number,
  cells: Record<string, ExtractedField>,
): Record<string, ExtractedField> {
  return Object.fromEntries(
    Object.entries(cells).map(([sub, v]) => [repeatKey(group, index, sub), v]),
  );
}
