import { verifyAccessCode } from "./_lib/access";
import { selectEngine, type EngineUsage } from "./_lib/engine";
import {
  accessCodeOf,
  clientIp,
  HttpError,
  json,
  readUpload,
} from "./_lib/http";
import { logRequest } from "./_lib/log";
import { createMemoryRateLimiter, dailyLimit } from "./_lib/rate-limit";

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
    const image = await readUpload(request);
    const engine = selectEngine();
    engineName = engine.name;
    const output = await engine.extract(image);
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
