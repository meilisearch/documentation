import { describe, expect, it } from "vitest";
import { isRecord, stringRecord, text, textField, textOrNull } from "../records.ts";

describe("isRecord", () => {
  it("rejects null, arrays, and primitives", () => {
    expect(isRecord(null)).toBe(false);
    expect(isRecord(undefined)).toBe(false);
    expect(isRecord(["page"])).toBe(false);
    expect(isRecord("page")).toBe(false);
    expect(isRecord(0)).toBe(false);
    expect(isRecord(true)).toBe(false);
  });

  it("accepts a plain object", () => {
    expect(isRecord({ page: "reference/search" })).toBe(true);
  });
});

describe("text", () => {
  it("returns strings and an empty string for other values", () => {
    expect(text("docs")).toBe("docs");
    expect(text("")).toBe("");
    expect(text(null)).toBe("");
    expect(text(1)).toBe("");
  });
});

describe("textOrNull", () => {
  it("returns strings and null for other values", () => {
    expect(textOrNull("docs")).toBe("docs");
    expect(textOrNull("")).toBe("");
    expect(textOrNull(undefined)).toBeNull();
    expect(textOrNull(1)).toBeNull();
  });
});

describe("stringRecord", () => {
  it("rejects a non-object and a record with a non-string value", () => {
    expect(stringRecord(null)).toBeUndefined();
    expect(stringRecord(["client.search()"])).toBeUndefined();
    expect(stringRecord("client.search()")).toBeUndefined();
    expect(stringRecord({ js: "client.search()", http: 1 })).toBeUndefined();
  });

  it("returns the strings otherwise", () => {
    expect(stringRecord({ js: "client.search()", http: "curl search" })).toEqual({
      js: "client.search()",
      http: "curl search",
    });
    expect(stringRecord({})).toEqual({});
  });
});

describe("textField", () => {
  it("reads a string field and returns undefined otherwise", () => {
    expect(textField({ page: "reference/search", title: 1 }, "page")).toBe("reference/search");
    expect(textField({ page: "reference/search" }, "title")).toBeUndefined();
    expect(textField({ title: 1 }, "title")).toBeUndefined();
    expect(textField(null, "page")).toBeUndefined();
    expect(textField(["reference/search"], "0")).toBeUndefined();
  });
});
