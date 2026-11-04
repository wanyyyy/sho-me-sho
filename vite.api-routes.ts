import type { IncomingMessage } from "node:http";
import { Readable } from "node:stream";
import { loadEnv, type Plugin } from "vite";

type Handler = (request: Request) => Promise<Response>;

/**
 * 로컬 개발용. api/<name>.ts 의 GET/POST 핸들러(Vercel 의 Web 시그니처)를
 * Vite dev 서버의 /api/<name> 에 붙여서 vercel CLI 없이도 pnpm dev 하나로 돈다
 */
export function apiRoutes(): Plugin {
  return {
    name: "api-routes",
    apply: "serve",
    config(_config, { mode }) {
      // 서버 함수는 process.env 를 읽으므로 .env.local 값을 올려 둔다 (이미 있는 값은 유지)
      for (const [key, value] of Object.entries(
        loadEnv(mode, process.cwd(), ""),
      ))
        process.env[key] ??= value;
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(
          req.url ?? "/",
          `http://${req.headers.host ?? "localhost"}`,
        );
        const match = /^\/api\/([\w-]+)$/.exec(url.pathname);
        if (!match) return next();
        try {
          const mod = await server.ssrLoadModule(`/api/${match[1]}.ts`);
          const handler = mod[req.method ?? "GET"] as Handler | undefined;
          if (!handler) {
            res.statusCode = 405;
            res.end("Method Not Allowed");
            return;
          }
          const response = await handler(toRequest(req, url));
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

function toRequest(req: IncomingMessage, url: URL): Request {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) value.forEach((v) => headers.append(key, v));
    else if (value) headers.set(key, value);
  }
  const hasBody = !["GET", "HEAD"].includes(req.method ?? "GET");
  return new Request(url, {
    method: req.method,
    headers,
    body: hasBody ? (Readable.toWeb(req) as ReadableStream) : undefined,
    // Node fetch 는 스트림 본문에 duplex 가 필요하다 (TS lib 에는 아직 없는 필드)
    ...(hasBody && { duplex: "half" }),
  } as RequestInit);
}
