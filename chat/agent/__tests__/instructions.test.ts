import { describe, expect, it } from "vitest";
import { systemInstructions, triageInstructions } from "../instructions.ts";

describe("systemInstructions", () => {
  it("includes the ISO date of the date it is given", () => {
    const now = new Date(Date.UTC(2024, 0, 2, 15, 30));

    expect(systemInstructions(now)).toContain("Today is 2024-01-02 (Tuesday, January 2, 2024).");
  });
});

describe("triageInstructions", () => {
  it("includes the ISO date of the date it is given", () => {
    const now = new Date(Date.UTC(2024, 0, 2, 15, 30));

    expect(triageInstructions(now)).toContain("Today is 2024-01-02.");
  });
});
