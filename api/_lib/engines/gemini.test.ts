import { SAMPLE_EXTRACTION } from "../../../src/entities/certificate/certificate.mock.ts";
import { MARRIAGE_FIELDS } from "../../../src/entities/certificate/marriage.template.ts";
import { buildPrompt, buildResponseSchema } from "./gemini.prompt.ts";
import {
  createGeminiEngine,
  type GeminiClient,
  geminiEngineFromEnv,
} from "./gemini.ts";

const image = {
  bytes: new Uint8Array([1, 2, 3]),
  mimeType: "image/jpeg",
  name: "a.jpg",
};

function fakeClient(text: string | undefined, usage?: object) {
  const generateContent = vi.fn<GeminiClient["models"]["generateContent"]>(
    async () => ({ text, usageMetadata: usage }),
  );
  return {
    client: { models: { generateContent } } as GeminiClient,
    generateContent,
  };
}

describe("buildPrompt / buildResponseSchema", () => {
  it("양식의 모든 키가 지시문과 스키마에 들어간다", () => {
    const prompt = buildPrompt();
    const schema = buildResponseSchema();
    for (const f of MARRIAGE_FIELDS) {
      expect(prompt).toContain(`- ${f.key}: ${f.labelJa}`);
      expect(schema.properties.fields.properties).toHaveProperty(f.key);
    }
    expect(schema.properties.fields.required).toHaveLength(
      MARRIAGE_FIELDS.length,
    );
  });
});

describe("createGeminiEngine", () => {
  it("이미지를 base64 로, 지시문·JSON 스키마와 함께 보내고 결과를 계약대로 검증한다", async () => {
    const { client, generateContent } = fakeClient(
      JSON.stringify(SAMPLE_EXTRACTION),
      {
        promptTokenCount: 1500,
        candidatesTokenCount: 800,
        thoughtsTokenCount: 200,
      },
    );
    const engine = createGeminiEngine({ apiKey: "k", model: "m", client });
    expect(engine.name).toBe("gemini:m");

    const out = await engine.extract(image);
    expect(out.result).toEqual(SAMPLE_EXTRACTION);
    expect(out.usage).toEqual({ inputTokens: 1500, outputTokens: 1000 });

    const params = generateContent.mock.calls[0][0];
    expect(params.model).toBe("m");
    const parts = (params.contents as { parts: unknown[] }[])[0]
      .parts as Record<string, unknown>[];
    expect(parts[0].inlineData).toEqual({
      mimeType: "image/jpeg",
      data: "AQID",
    });
    expect(parts[1].text).toBe(buildPrompt());
    expect(params.config?.responseMimeType).toBe("application/json");
    expect(params.config?.responseJsonSchema).toEqual(buildResponseSchema());
  });

  it("빈 응답이나 계약에 안 맞는 JSON 은 거부한다", async () => {
    const empty = createGeminiEngine({
      apiKey: "k",
      client: fakeClient(undefined).client,
    });
    await expect(empty.extract(image)).rejects.toThrow(/빈 응답/);

    const bad = createGeminiEngine({
      apiKey: "k",
      client: fakeClient(JSON.stringify({ documentType: "marriage" })).client,
    });
    await expect(bad.extract(image)).rejects.toThrow();
  });
});

describe("geminiEngineFromEnv", () => {
  it("키가 없으면 실패하고, 모델은 환경변수로 고른다", () => {
    expect(() => geminiEngineFromEnv({})).toThrow(/GEMINI_API_KEY/);
    expect(
      geminiEngineFromEnv({ GEMINI_API_KEY: "k", GEMINI_MODEL: "x" }).name,
    ).toBe("gemini:x");
  });
});
