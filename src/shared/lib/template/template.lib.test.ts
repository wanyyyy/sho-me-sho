import {
  documentKeys,
  fieldOf,
  repeatKey,
  repeatRowKeys,
  repeatRows,
  sampleField,
  sampleRow,
} from "./template.lib";
import type { DocumentTemplate } from "./template.types";

const rows = {
  key: "rows",
  labelKo: "행",
  labelJa: "行",
  fields: [
    { sub: "label", labelKo: "항목", labelJa: "項目", kind: "text" as const },
    { sub: "value", labelKo: "내용", labelJa: "内容", kind: "date" as const },
  ],
};

const template: DocumentTemplate = {
  type: "t",
  source: "ko",
  target: "ja",
  title: { ko: "t", ja: "t" },
  description: "",
  orientation: "portrait",
  fields: [{ key: "a", labelKo: "가", labelJa: "ア", kind: "text" }],
  repeats: [rows],
  prompt: { intro: "", rules: [] },
  sections: () => [],
  fileName: () => "t",
};

describe("template.lib", () => {
  it("고정 칸은 선언 그대로, 가변 행은 패턴으로 만든다", () => {
    expect(fieldOf(template, "a").labelJa).toBe("ア");
    expect(fieldOf(template, repeatKey("rows", 1, "value"))).toEqual({
      key: "rows.1.value",
      labelKo: "행 2 내용",
      labelJa: "行 2 内容",
      kind: "date",
    });
    expect(fieldOf(template, "없는키").kind).toBe("text");
  });

  it("가변 행 번호는 결과와 수정값에서 모은다", () => {
    const hi = sampleField("high");
    const doc = {
      extracted: {
        ...sampleRow("rows", 2, { value: hi("", "") }),
        ...sampleRow("rows", 0, { label: hi("", "") }),
        "other.0.label": hi("", ""),
      },
      edits: { "rows.5.label": "x" },
    };
    expect(repeatRows(rows, doc)).toEqual([0, 2, 5]);
    expect(repeatRowKeys(rows, 0)).toEqual(["rows.0.label", "rows.0.value"]);
    expect(documentKeys(template, doc)).toEqual([
      "a",
      ...[0, 2, 5].flatMap((i) => repeatRowKeys(rows, i)),
    ]);
  });
});
