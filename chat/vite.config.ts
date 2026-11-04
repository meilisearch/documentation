import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { build, defineConfig, loadEnv, type Plugin } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

/**
 * Local dev only (`npm run dev`):
 * - rebuilds `dist/chat.js` in watch mode and serves it at `/chat.js`
 * - routes `/api/chat` to the same Web `Request`/`Response` handler Vercel runs in production
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

        if (url.pathname === "/api/chat") {
          try {
            const mod = await server.ssrLoadModule("/api/chat.ts");
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
            console.error("[chat] /api/chat failed", error);
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
  // Lib builds do not replace this; React needs it in the browser.
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  server: { port: 5173, cors: true },
  build: {
    outDir: "dist",
    lib: {
      entry: path.join(root, "src/main.tsx"),
      formats: ["iife"],
      name: "MeiliChat",
      fileName: () => "chat.js",
    },
    cssCodeSplit: false,
  },
});
