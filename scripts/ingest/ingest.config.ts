import { defineConfig } from "./config.ts";

export default defineConfig({
  baseUrl: "https://www.meilisearch.com/docs",
  navigation: "config/navigation.json",
  exclude: [],
  sources: { mdx: true, codeSamples: true, images: false },
  chunking: { splitDepth: 3, maxChars: 2000, minChars: 200 },
  meilisearch: {
    indexUid: "docs-chunks",
    routesIndexUid: "api-routes",
    embedder: { name: "voyage", model: "voyage-4" },
  },
});
