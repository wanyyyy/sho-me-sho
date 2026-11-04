import type { EngineUsage } from "./engine.ts";

export type RequestLog = {
  ip: string;
  engine: string;
  status: number;
  ms: number;
  usage?: EngineUsage;
};

/**
 * 호출 1건당 한 줄. 누가(IP)·언제·얼마나(토큰) 썼는지만 남기고
 * 이미지·추출 결과·접근 코드는 절대 기록하지 않는다
 */
export function logRequest(entry: RequestLog): void {
  console.log(JSON.stringify({ at: new Date().toISOString(), ...entry }));
}
