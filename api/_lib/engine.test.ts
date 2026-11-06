import { ExtractionResultSchema } from "../../src/entities/certificate/certificate.contracts.ts";
import { DocumentTypeSchema } from "../../src/entities/certificate/certificate.contracts.ts";
import { templateOf } from "./documents.ts";
import { selectEngine } from "./engine.ts";

describe("selectEngine", () => {
  it("sample 엔진은 서류 종류마다 계약에 맞는 결과를 돌려준다", async () => {
    const engine = selectEngine("sample");
    for (const type of DocumentTypeSchema.options) {
      const { result } = await engine.extract(
        [{ bytes: new Uint8Array(), mimeType: "image/jpeg", name: "a.jpg" }],
        templateOf(type),
      );
      expect(ExtractionResultSchema.safeParse(result).success).toBe(true);
      expect(result.documentType).toBe(type);
    }
  });

  it("모르는 이름이면 바로 실패한다", () => {
    expect(() => selectEngine("nope")).toThrow(/알 수 없는 엔진/);
  });

  it("gemini 는 키가 없으면 선택 시점에 실패한다", () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    expect(() => selectEngine("gemini")).toThrow(/GEMINI_API_KEY/);
    vi.unstubAllEnvs();
  });
});
