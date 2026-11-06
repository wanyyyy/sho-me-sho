import { ConfidenceSchema } from "../../../src/entities/certificate/certificate.contracts.ts";
import { repeatKey } from "../../../src/shared/lib/template/template.lib.ts";
import type {
  DocumentTemplate,
  Lang,
} from "../../../src/shared/lib/template/template.types.ts";

const LANG_NAME: Record<Lang, string> = { ja: "일본어", ko: "한국어" };

const KIND_NOTE: Record<string, string> = {
  date: "날짜",
  name: "인명",
  number: "번호. 반각 숫자로",
  text: "",
};

/** 템플릿 선언에서 만든 지시문. 칸·규칙을 추가하면 여기도 자동으로 따라온다 */
export function buildPrompt(template: DocumentTemplate): string {
  const { source, target } = template;
  const fieldLines = template.fields.map((f) => {
    const note = KIND_NOTE[f.kind];
    return `- ${f.key}: ${f.labelJa} (${f.labelKo})${note ? ` — ${note}` : ""}`;
  });
  const repeatLines = template.repeats.flatMap((g) => [
    `- 배열 ${g.key}: ${g.labelJa} (${g.labelKo}). 행마다 객체 하나, 행 수는 서류에 있는 만큼:`,
    ...g.fields.map((f) => `    - ${f.sub}: ${f.labelJa} (${f.labelKo})`),
  ]);
  return [
    template.prompt.intro,
    "",
    "규칙:",
    `- ${source}: 칸의 ${LANG_NAME[source]} 원문을 그대로 (줄바꿈은 공백 하나로).`,
    `- ${target}: ${source} 의 ${LANG_NAME[target]} 번역.`,
    "- 이미지가 여러 장이면 서류의 1쪽, 2쪽 … 순서다.",
    "- confidence: high = 또렷이 읽힘, medium = 일부 글자가 불확실, low = 흐리거나 추정. 손글씨·도장 위 글자는 보수적으로.",
    `- 비어 있는 칸은 ja·ko 모두 빈 문자열.`,
    ...template.prompt.rules.map((r) => `- ${r}`),
    `- documentType 은 "${template.type}".`,
    "",
    "채울 키:",
    ...fieldLines,
    ...(repeatLines.length ? ["", "가변 행:", ...repeatLines] : []),
  ].join("\n");
}

const FIELD_SCHEMA = {
  type: "object",
  properties: {
    ja: { type: "string" },
    ko: { type: "string" },
    confidence: { type: "string", enum: ConfidenceSchema.options },
  },
  required: ["ja", "ko", "confidence"],
} as const;

/**
 * 모델 응답을 강제하는 JSON 스키마. 고정 칸은 모두 required, 가변 행 그룹은 배열.
 * 응답 모양: { documentType, fields: {...고정}, [group]: [{sub: FIELD}...] }
 */
export function buildResponseSchema(template: DocumentTemplate) {
  const keys = template.fields.map((f) => f.key);
  const groups = Object.fromEntries(
    template.repeats.map((g) => [
      g.key,
      {
        type: "array",
        items: {
          type: "object",
          properties: Object.fromEntries(
            g.fields.map((f) => [f.sub, FIELD_SCHEMA]),
          ),
          required: g.fields.map((f) => f.sub),
        },
      },
    ]),
  );
  return {
    type: "object",
    properties: {
      documentType: { type: "string", enum: [template.type] },
      fields: {
        type: "object",
        properties: Object.fromEntries(keys.map((k) => [k, FIELD_SCHEMA])),
        required: keys,
      },
      ...groups,
    },
    required: ["documentType", "fields", ...template.repeats.map((g) => g.key)],
  };
}

type RawField = { ja?: unknown; ko?: unknown; confidence?: unknown };

/** 모델의 중첩 응답(배열) → 계약의 평면 키 (`group.0.sub`). 검증은 호출 쪽에서 zod 로 */
export function flattenResponse(
  template: DocumentTemplate,
  raw: unknown,
): unknown {
  if (typeof raw !== "object" || raw === null) return raw;
  const data = raw as Record<string, unknown>;
  const fields: Record<string, unknown> = {
    ...(typeof data.fields === "object" && data.fields ? data.fields : {}),
  };
  for (const group of template.repeats) {
    const rows = Array.isArray(data[group.key]) ? data[group.key] : [];
    (rows as RawField[]).forEach((row, i) => {
      if (typeof row !== "object" || row === null) return;
      for (const f of group.fields) {
        fields[repeatKey(group.key, i, f.sub)] = (
          row as Record<string, unknown>
        )[f.sub];
      }
    });
  }
  return { documentType: template.type, fields };
}
