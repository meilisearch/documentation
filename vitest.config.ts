import { configDefaults, defineConfig } from "vitest/config";

const unit = ["**/*.integration.test.ts"];

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "node",
          environment: "node",
          include: ["scripts/ingest/**/*.test.ts", "chat/{agent,shared}/**/__tests__/**/*.test.ts"],
          exclude: [...configDefaults.exclude, ...unit],
        },
      },
      {
        test: {
          name: "react",
          environment: "jsdom",
          setupFiles: ["chat/app/test-setup.ts"],
          include: ["chat/app/**/__tests__/**/*.test.{ts,tsx}"],
          exclude: [...configDefaults.exclude, ...unit],
        },
      },
    ],
  },
});
