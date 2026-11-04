import {
  ConfidenceSchema,
  DocumentTypeSchema,
} from "../../../src/entities/certificate/certificate.contracts.ts";
import { MARRIAGE_FIELDS } from "../../../src/entities/certificate/marriage.template.ts";

const KIND_NOTE: Record<string, string> = {
  date: "날짜. ja 는 원문 연호 그대로(예: 令和７年９月６日), ko 는 서기로(예: 2025년 9월 6일)",
  name: "인명. ko 는 한글 표기(일본인은 일본어 발음, 한국인은 한국 이름)",
  number: "번호. ja·ko 모두 반각 숫자로",
  text: "",
};

/** 양식 선언(MARRIAGE_FIELDS)에서 만든 지시문. 칸을 추가하면 여기도 자동으로 따라온다 */
export function buildPrompt(): string {
  const lines = MARRIAGE_FIELDS.map((f) => {
    const note = KIND_NOTE[f.kind];
    return `- ${f.key}: ${f.labelJa} (${f.labelKo})${note ? ` — ${note}` : ""}`;
  });
  return [
    "이 이미지는 일본 관공서가 발행한 수리증명서(受理証明書)다. 표의 각 칸을 읽어 아래 키에 맞춰 JSON 으로 채워라.",
    "",
    "규칙:",
    "- ja: 칸의 원문을 그대로 (한자·가나·전각 숫자 유지, 줄바꿈은 공백 하나로).",
    "- ko: ja 의 자연스러운 한국어 번역. 지명·주소는 한글 음역(예: 東京都新宿区 → 도쿄도 신주쿠구).",
    '- 원본에서 비공개 처리된 칸(＊ 또는 검게 가려짐)은 ja·ko 모두 "＊＊＊＊＊".',
    "- 비어 있는 칸은 ja·ko 모두 빈 문자열.",
    "- confidence: high = 또렷이 읽힘, medium = 일부 글자가 불확실, low = 흐리거나 추정. 손글씨·도장 위 글자는 보수적으로.",
    "- 사건본인 행은 위에서부터 1~4. 없는 행은 빈 문자열로 둔다.",
    "- 続柄(관계)의 ko 는 양식 관례대로 妻 → 처, 夫 → 부, 子 → 자.",
    `- documentType 은 "${DocumentTypeSchema.options[0]}".`,
    "",
    "채울 키:",
    ...lines,
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

/** 모델 응답을 강제하는 JSON 스키마. 모든 키를 required 로 두어 빠뜨리지 못하게 한다 */
export function buildResponseSchema() {
  const keys = MARRIAGE_FIELDS.map((f) => f.key);
  return {
    type: "object",
    properties: {
      documentType: { type: "string", enum: DocumentTypeSchema.options },
      fields: {
        type: "object",
        properties: Object.fromEntries(keys.map((k) => [k, FIELD_SCHEMA])),
        required: keys,
      },
    },
    required: ["documentType", "fields"],
  };
}
