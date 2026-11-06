import { MARRIAGE_SAMPLE } from "../../../src/features/marriage/marriage.mock.ts";
import { MARRIAGE_FIELDS } from "../../../src/features/marriage/marriage.model.ts";
import { templateOf } from "../documents.ts";
import {
  buildPrompt,
  buildResponseSchema,
  flattenResponse,
} from "./gemini.prompt.ts";
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
const marriage = templateOf("marriage");
const basic = templateOf("basic");

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
  it("고정 칸은 모두 지시문과 스키마에 들어간다", () => {
    const prompt = buildPrompt(marriage);
    const schema = buildResponseSchema(marriage);
    for (const f of MARRIAGE_FIELDS) {
      expect(prompt).toContain(`- ${f.key}: ${f.labelJa}`);
      expect(schema.properties.fields.properties).toHaveProperty(f.key);
    }
    expect(schema.properties.fields.required).toHaveLength(
      MARRIAGE_FIELDS.length,
    );
    expect(schema.required).toEqual(["documentType", "fields"]);
  });

  it("가변 행 그룹은 배열 스키마로, 지시문에는 열 설명이 들어간다", () => {
    const prompt = buildPrompt(basic);
    const schema = buildResponseSchema(basic) as {
      required: string[];
      properties: Record<
        string,
        { type: string; items?: { required: string[] } }
      >;
    };
    expect(prompt).toContain("- 배열 history: 詳細内容 (상세내용)");
    expect(prompt).toContain("- 배열 general:");
    expect(schema.required).toEqual([
      "documentType",
      "fields",
      "history",
      "general",
    ]);
    expect(schema.properties.history.type).toBe("array");
    expect(schema.properties.history.items?.required).toEqual([
      "category",
      "label",
      "value",
    ]);
  });
});

describe("flattenResponse", () => {
  it("배열 행을 group.i.sub 평면 키로 편다", () => {
    const f = { ja: "a", ko: "b", confidence: "high" };
    const out = flattenResponse(basic, {
      documentType: "basic",
      fields: { registryBase: f },
      history: [
        { category: f, label: f, value: f },
        { category: f, label: f, value: f },
      ],
      general: [],
    }) as { documentType: string; fields: Record<string, unknown> };
    expect(out.documentType).toBe("basic");
    expect(Object.keys(out.fields)).toEqual([
      "registryBase",
      "history.0.category",
      "history.0.label",
      "history.0.value",
      "history.1.category",
      "history.1.label",
      "history.1.value",
    ]);
  });
});

describe("createGeminiEngine", () => {
  it("이미지를 base64 로, 템플릿 지시문·JSON 스키마와 함께 보내고 결과를 계약대로 검증한다", async () => {
    const { client, generateContent } = fakeClient(
      JSON.stringify(MARRIAGE_SAMPLE),
      {
        promptTokenCount: 1500,
        candidatesTokenCount: 800,
        thoughtsTokenCount: 200,
      },
    );
    const engine = createGeminiEngine({ apiKey: "k", model: "m", client });
    expect(engine.name).toBe("gemini:m");

    const out = await engine.extract([image, image], marriage);
    expect(out.result).toEqual(MARRIAGE_SAMPLE);
    expect(out.usage).toEqual({ inputTokens: 1500, outputTokens: 1000 });

    const params = generateContent.mock.calls[0][0];
    expect(params.model).toBe("m");
    const parts = (params.contents as { parts: unknown[] }[])[0]
      .parts as Record<string, unknown>[];
    expect(parts.map((p) => p.text ?? "img")).toEqual([
      "1쪽:",
      "img",
      "2쪽:",
      "img",
      buildPrompt(marriage),
    ]);
    expect(parts[1].inlineData).toEqual({
      mimeType: "image/jpeg",
      data: "AQID",
    });
    expect(params.config?.responseMimeType).toBe("application/json");
    expect(params.config?.responseJsonSchema).toEqual(
      buildResponseSchema(marriage),
    );
  });

  it("빈 응답이나 계약에 안 맞는 JSON 은 거부한다", async () => {
    const empty = createGeminiEngine({
      apiKey: "k",
      client: fakeClient(undefined).client,
    });
    await expect(empty.extract([image], marriage)).rejects.toThrow(/빈 응답/);

    const bad = createGeminiEngine({
      apiKey: "k",
      client: fakeClient(
        JSON.stringify({ documentType: "marriage", fields: { x: { ja: 1 } } }),
      ).client,
    });
    await expect(bad.extract([image], marriage)).rejects.toThrow();
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
