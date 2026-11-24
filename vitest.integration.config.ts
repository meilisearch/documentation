import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "integration",
    environment: "node",
    include: ["scripts/**/*.integration.test.ts"],
    globalSetup: ["scripts/ingest/__tests__/integration-setup.ts"],
  },
});
