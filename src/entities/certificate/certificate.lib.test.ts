import {
  countStatuses,
  fieldStatus,
  fieldStatuses,
  fieldValue,
  normalizeExtraction,
} from "./certificate.lib";
import { SAMPLE_EXTRACTION } from "./certificate.mock";
import { CertificateDocument } from "./certificate.types";
import { K, MARRIAGE_FIELD_MAP, MARRIAGE_FIELDS } from "./marriage.template";

const doc: CertificateDocument = {
  id: "t",
  documentType: "marriage",
  source: { name: "a.jpg", previewUrl: "blob:x" },
  extracted: SAMPLE_EXTRACTION.fields,
  edits: { [K.personRegistry(0)]: "수정한 본적" },
};
const field = (key: string) => MARRIAGE_FIELD_MAP[key];

describe("certificate.lib", () => {
  it("수정값이 있으면 수정값, 없으면 모델 번역값", () => {
    expect(fieldValue(doc, K.personRegistry(0))).toBe("수정한 본적");
    expect(fieldValue(doc, K.issuedAt)).toBe("2025년 9월 10일");
    expect(fieldValue(doc, "없는키")).toBe("");
  });

  it("상태: 수정됨 > 확인 필요 > 확인됨", () => {
    expect(fieldStatus(doc, field(K.personRegistry(0)))).toBe("edited");
    expect(fieldStatus(doc, field(K.personName(1)))).toBe("review"); // low + 인명
    expect(fieldStatus(doc, field(K.personName(0)))).toBe("review"); // 인명은 항상
    expect(fieldStatus(doc, field(K.issuerTitle))).toBe("ok");
    expect(fieldStatus(doc, field(K.issuedAt))).toBe("ok");
  });

  it("추출되지 않았거나 비어 있는 칸은 missing", () => {
    expect(fieldStatus(doc, field(K.personKana(2)))).toBe("missing"); // 결과에 없음
    expect(fieldStatus(doc, field(K.personKana(1)))).toBe("missing"); // ja·ko 모두 빈 문자열
  });

  it("상태별 칸 수를 센다", () => {
    const counts = countStatuses(fieldStatuses(doc, MARRIAGE_FIELDS));
    expect(counts.edited).toBe(1);
    expect(counts.edited + counts.review + counts.ok + counts.missing).toBe(
      MARRIAGE_FIELDS.length,
    );
  });

  it("normalizeExtraction 은 date 칸의 번역을 원문 연호에서 다시 계산한다", () => {
    const result = normalizeExtraction({
      documentType: "marriage",
      fields: {
        [K.issuedAt]: {
          ja: "令和８年１０月６日",
          ko: "틀린 값",
          confidence: "high",
        },
        [K.issuerName]: { ja: "上甲 誠", ko: "그대로", confidence: "high" },
      },
    });
    expect(result.fields[K.issuedAt].ko).toBe("2026년 10월 6일");
    expect(result.fields[K.issuerName].ko).toBe("그대로");
  });
});
