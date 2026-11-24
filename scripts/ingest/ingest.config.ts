import { defineConfig } from "./config.ts";

export default defineConfig({
  navigation: "config/navigation.json",
  exclude: ["changelog/v*"],
  sources: { mdx: true, codeSamples: true, images: false },
  chunking: { splitDepth: 3, maxChars: 2000, minChars: 200 },
  meilisearch: {
    indexUid: "docs-chunks",
    routesIndexUid: "api-routes",
    changelogIndexUid: "changelog-chunks",
    embedder: { name: "voyage", model: "voyage-4" },
  },
});
