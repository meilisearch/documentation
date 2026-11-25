import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { build, defineConfig, loadEnv, type Plugin } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

/**
 * Origin the widget calls. Vercel sets these during the build:
 * preview deployments use the stable branch URL (`VERCEL_BRANCH_URL`),
 * production uses `VERCEL_PROJECT_PRODUCTION_URL`. Empty outside Vercel,
 * where the loader passes the origin instead.
 */
function chatOrigin(): string {
  const host =
    process.env.VERCEL_ENV === "preview"
      ? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL
      : process.env.VERCEL_ENV === "production"
        ? process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
        : "";
  return host ? `https://${host}` : "";
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

/**
 * Local dev only (`npm run dev`):
 * - rebuilds `dist/chat.js` in watch mode and serves it at `/chat.js`
 * - routes `/api/chat` and `/api/events` to the same Web `Request`/`Response` handlers Vercel runs in production
 */
function devServer(): Plugin {
  return {
    name: "meili-chat-dev-server",
    apply: "serve",
    async configureServer(server) {
      Object.assign(process.env, loadEnv("development", root, ""));

      // The bundle defines NODE_ENV as production, so the dev JSX runtime would be missing.
      // Vite ignores `mode` when NODE_ENV is already set, so flip it while the build config resolves.
      const previousNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      let watcher;
      try {
        watcher = await build({
          root,
          mode: "production",
          logLevel: "warn",
          build: { watch: {}, minify: false, sourcemap: true },
        });
      } finally {
        process.env.NODE_ENV = previousNodeEnv;
      }
      if ("close" in watcher) server.httpServer?.on("close", () => void watcher.close());

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");

        if (url.pathname === "/chat.js") {
          const file = path.join(root, "dist/chat.js");
          if (!existsSync(file)) return next();
          res.writeHead(200, {
            ...CORS_HEADERS,
            "Content-Type": "text/javascript; charset=utf-8",
            "Cache-Control": "no-store",
          });
          createReadStream(file).pipe(res);
          return;
        }

        const api = /^\/api\/(chat|events)$/.exec(url.pathname);
        if (api) {
          const name = api[1];
          try {
            const mod = await server.ssrLoadModule(`/api/${name}.ts`);
            const method = req.method ?? "GET";
            const handler = mod[method];
            if (typeof handler !== "function") {
              res.writeHead(405).end();
              return;
            }

            const headers = new Headers();
            for (const [key, value] of Object.entries(req.headers)) {
              if (typeof value === "string") headers.set(key, value);
            }
            const hasBody = method !== "GET" && method !== "HEAD";
            const request = new Request(`http://${req.headers.host}${req.url}`, {
              method,
              headers,
              body: hasBody ? (Readable.toWeb(req) as ReadableStream) : undefined,
              // @ts-expect-error required by Node when sending a streaming body
              duplex: "half",
            });

            const response: Response = await handler(request);
            res.writeHead(response.status, Object.fromEntries(response.headers));
            if (response.body) {
              const reader = response.body.getReader();
              res.on("close", () => void reader.cancel());
              for (; ;) {
                const { done, value } = await reader.read();
                if (done) break;
                res.write(value);
              }
            }
            res.end();
          } catch (error) {
            console.error(`[chat] /api/${name} failed`, error);
            if (!res.headersSent) res.writeHead(500);
            res.end("Internal error");
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  root,
  plugins: [react(), tailwindcss(), devServer()],
  // Lib builds do not replace NODE_ENV; React needs it in the browser.
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    __MEILI_CHAT_ORIGIN__: JSON.stringify(chatOrigin()),
    __MEILI_CHAT_POSTHOG_TOKEN__: JSON.stringify(process.env.POSTHOG_PROJECT_TOKEN ?? ""),
  },
  // Bind IPv4 explicitly. Listening on localhost alone can be IPv6-only, which the browser misses.
  server: { host: "127.0.0.1", port: 5173, cors: true },
  build: {
    outDir: "dist",
    lib: {
      entry: path.join(root, "app/main.tsx"),
      formats: ["iife"],
      name: "MeiliChat",
      fileName: () => "chat.js",
    },
    cssCodeSplit: false,
  },
});
