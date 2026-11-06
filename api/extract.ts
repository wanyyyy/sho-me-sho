import { accessCodeHash, verifyAccessCode } from "./_lib/access.ts";
import {
  DEFAULT_ENGINE,
  type EngineUsage,
  selectEngine,
} from "./_lib/engine.ts";
import {
  accessCodeOf,
  clientIp,
  HttpError,
  json,
  readUpload,
} from "./_lib/http.ts";
import { logRequest } from "./_lib/log.ts";
import { createMemoryRateLimiter, dailyLimit } from "./_lib/rate-limit.ts";

const HEX_64 = /^[0-9a-f]{64}$/;

/** GET /api/extract — 설정 점검용. 해시 값 자체는 내보내지 않고 "있는지·형식이 맞는지"만 알려 준다 */
export async function GET(): Promise<Response> {
  const hash = accessCodeHash();
  return json({
    engine: process.env.EXTRACT_ENGINE ?? DEFAULT_ENGINE,
    dailyLimit: dailyLimit(),
    gate: hash ? (HEX_64.test(hash) ? "on" : "invalid-hash") : "off",
  });
}

/** 따뜻한 인스턴스가 살아 있는 동안 유지되는 IP 별 횟수 */
const limiter = createMemoryRateLimiter(dailyLimit());

/**
 * POST /api/extract — multipart(file) → 읽기·번역 결과 JSON.
 * 순서: 접근 코드 → IP 일일 한도 → 업로드 검사 → 엔진 호출. 본문은 코드가 맞을 때만 읽는다
 */
export async function POST(request: Request): Promise<Response> {
  const started = Date.now();
  const ip = clientIp(request);
  let status = 200;
  let engineName = "-";
  let usage: EngineUsage | undefined;

  try {
    if (!verifyAccessCode(accessCodeOf(request))) {
      throw new HttpError(401, "접근 코드가 맞지 않습니다.");
    }
    if (!limiter.hit(ip).allowed) {
      throw new HttpError(
        429,
        "오늘 사용할 수 있는 횟수를 넘었습니다. 내일 다시 시도해 주세요.",
      );
    }
    const { images, template } = await readUpload(request);
    const engine = selectEngine();
    engineName = engine.name;
    const output = await engine.extract(images, template);
    usage = output.usage;
    return json(output.result);
  } catch (error) {
    status = error instanceof HttpError ? error.status : 500;
    if (status === 500) console.error(error);
    const message =
      error instanceof HttpError ? error.message : "읽기에 실패했습니다.";
    return json({ error: message }, status);
  } finally {
    logRequest({
      ip,
      engine: engineName,
      status,
      ms: Date.now() - started,
      usage,
    });
  }
}
