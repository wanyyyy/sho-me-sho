import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { ExtractionResultSchema } from "../../../src/entities/certificate/certificate.contracts.ts";
import type { DocumentTemplate } from "../../../src/shared/lib/template/template.types.ts";
import type { EngineOutput, ImageInput, ServerExtractor } from "../engine.ts";
import {
  buildPrompt,
  buildResponseSchema,
  flattenResponse,
} from "./gemini.prompt.ts";

export const DEFAULT_GEMINI_MODEL = "gemini-3.8-flash";
/** Vercel 함수 60초 안에 끝나도록 모델 호출은 그보다 짧게 끊는다 */
const TIMEOUT_MS = 50_000;

/** 테스트에서 SDK 를 가짜로 바꿀 수 있게 필요한 부분만 좁힌 타입 */
export type GeminiClient = {
  models: {
    generateContent: (
      params: Parameters<GoogleGenAI["models"]["generateContent"]>[0],
    ) => Promise<{
      text?: string;
      usageMetadata?: {
        promptTokenCount?: number;
        candidatesTokenCount?: number;
        thoughtsTokenCount?: number;
      };
    }>;
  };
};

type GeminiOptions = {
  apiKey: string;
  model?: string;
  client?: GeminiClient;
};

export function createGeminiEngine({
  apiKey,
  model = DEFAULT_GEMINI_MODEL,
  client = new GoogleGenAI({ apiKey }),
}: GeminiOptions): ServerExtractor {
  return {
    name: `gemini:${model}`,
    async extract(
      images: ImageInput[],
      template: DocumentTemplate,
    ): Promise<EngineOutput> {
      const prompt = buildPrompt(template);
      const responseJsonSchema = buildResponseSchema(template);
      const response = await client.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [
              // 쪽마다 "N쪽" 표시 + 이미지. 지시문은 맨 뒤
              ...images.flatMap((image, i) => [
                { text: `${i + 1}쪽:` },
                {
                  inlineData: {
                    mimeType: image.mimeType,
                    data: Buffer.from(image.bytes).toString("base64"),
                  },
                },
              ]),
              { text: prompt },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseJsonSchema,
          // 표 읽기는 긴 추론이 필요 없다. 기본(high)은 생각 토큰이 응답의 대부분을 차지해 느리고 비싸다
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          httpOptions: { timeout: TIMEOUT_MS },
        },
      });
      const text = response.text;
      if (!text) throw new Error("모델이 빈 응답을 돌려줬습니다");
      const usage = response.usageMetadata;
      return {
        result: ExtractionResultSchema.parse(
          flattenResponse(template, JSON.parse(text)),
        ),
        usage: {
          inputTokens: usage?.promptTokenCount,
          outputTokens:
            (usage?.candidatesTokenCount ?? 0) +
            (usage?.thoughtsTokenCount ?? 0),
        },
      };
    },
  };
}

/** 환경변수에서 엔진을 만든다. 키가 없으면 선택 시점에 바로 실패 */
export function geminiEngineFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): ServerExtractor {
  const apiKey = env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error("GEMINI_API_KEY 가 설정되지 않았습니다");
  return createGeminiEngine({
    apiKey,
    model: env.GEMINI_MODEL?.trim() || undefined,
  });
}
