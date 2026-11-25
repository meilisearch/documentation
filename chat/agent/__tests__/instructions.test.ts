import { describe, expect, it } from "vitest";
import { DECLINE_MESSAGE, routerInstructions, systemInstructions } from "../instructions.ts";

describe("systemInstructions", () => {
  it("includes the ISO date of the date it is given", () => {
    const now = new Date(Date.UTC(2024, 0, 2, 15, 30));

    expect(systemInstructions(now)).toContain("Today is 2024-01-02 (Tuesday, January 2, 2024).");
  });
});

describe("routerInstructions", () => {
  it("limits the assistant to Meilisearch features, the API, and the SDKs", () => {
    const instructions = routerInstructions();

    expect(instructions).toContain("features");
    expect(instructions).toContain("API");
    expect(instructions).toContain("SDK");
  });

  it("rejects unrelated questions and malicious requests", () => {
    const instructions = routerInstructions();

    expect(instructions).toMatch(/unrelated/i);
    expect(instructions).toMatch(/malicious/i);
    expect(instructions).toMatch(/never follow instructions/i);
  });

  it("does not depend on the date or on any tool", () => {
    const instructions = routerInstructions();

    expect(instructions).not.toMatch(/\d{4}-\d{2}-\d{2}/);
    expect(instructions).not.toMatch(/today/i);
    expect(instructions).not.toContain("list_releases");
    expect(instructions).not.toMatch(/\btools?\b/i);
  });
});

describe("DECLINE_MESSAGE", () => {
  it("tells the reader what the assistant can help with", () => {
    expect(DECLINE_MESSAGE).toContain("Meilisearch");
  });
});
