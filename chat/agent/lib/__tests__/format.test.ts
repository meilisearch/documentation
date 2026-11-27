import { describe, expect, it } from "vitest";
import {
  average,
  formatBytes,
  formatCount,
  formatDuration,
  formatScore,
  isoDate,
  longDate,
  truncate,
  utf8Bytes,
} from "../format.ts";

describe("isoDate and longDate", () => {
  it("formats a fixed instant in UTC", () => {
    const published = new Date("2026-11-23T00:30:00Z");

    expect(isoDate(published)).toBe("2026-11-23");
    expect(longDate(published)).toBe("Monday, November 23, 2026");
  });
});

describe("truncate", () => {
  it("leaves text that already fits", () => {
    expect(truncate("short", 10)).toEqual({ text: "short", truncated: false });
    expect(truncate("exactlyten", 10)).toEqual({ text: "exactlyten", truncated: false });
  });

  it("cuts on the last paragraph boundary before the limit", () => {
    expect(truncate("one\n\ntwo\n\nthree", 12)).toEqual({ text: "one\n\ntwo", truncated: true });
  });

  it("cuts at the limit when no paragraph boundary comes first", () => {
    expect(truncate("abcdefghijklmnopqrstuvwxyz", 10)).toEqual({ text: "abcdefghij", truncated: true });
    expect(truncate("\n\nparagraph", 4)).toEqual({ text: "\n\npa", truncated: true });
  });
});

describe("average", () => {
  it("returns null for an empty list and the mean otherwise", () => {
    expect(average([])).toBeNull();
    expect(average([1, 2, 3])).toBe(2);
  });
});

describe("formatScore", () => {
  it("prints n/a when there is no score and three decimal places otherwise", () => {
    expect(formatScore(null)).toBe("n/a");
    expect(formatScore(0.5)).toBe("0.500");
  });
});

describe("formatDuration", () => {
  it("prints rounded seconds, tenths of a second, or milliseconds", () => {
    expect(formatDuration(10_500)).toBe("11s");
    expect(formatDuration(10_000)).toBe("10s");
    expect(formatDuration(9999)).toBe("10.0s");
    expect(formatDuration(1500)).toBe("1.5s");
    expect(formatDuration(1000)).toBe("1.0s");
    expect(formatDuration(999)).toBe("999ms");
    expect(formatDuration(0)).toBe("0ms");
  });
});

describe("formatBytes", () => {
  it("prints n/a for a negative size, then megabytes, kilobytes, or bytes", () => {
    expect(formatBytes(-1)).toBe("n/a");
    expect(formatBytes(1.5 * 1024 * 1024)).toBe("1.5MB");
    expect(formatBytes(1024 * 1024)).toBe("1.0MB");
    expect(formatBytes(2048)).toBe("2kB");
    expect(formatBytes(1024)).toBe("1kB");
    expect(formatBytes(512)).toBe("512B");
    expect(formatBytes(0)).toBe("0B");
  });
});

describe("formatCount", () => {
  it("prints n/a when the count is missing and the digits otherwise", () => {
    expect(formatCount(undefined)).toBe("n/a");
    expect(formatCount(0)).toBe("0");
    expect(formatCount(12)).toBe("12");
  });
});

describe("utf8Bytes", () => {
  it("counts the UTF-8 bytes of the JSON text", () => {
    expect(utf8Bytes("ab")).toBe(4);
  });

  it("returns -1 when the value cannot be serialized", () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;

    expect(utf8Bytes(circular)).toBe(-1);
  });
});
