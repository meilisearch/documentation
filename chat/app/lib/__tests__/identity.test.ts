import { describe, expect, it } from "vitest";
import { readPostHogIdentity } from "../identity.ts";

const token = "phc_test";
const stored = JSON.stringify({
  distinct_id: "ph-visitor-1",
  $sesid: [1, "ph-session-1"],
});

describe("readPostHogIdentity", () => {
  it("reads distinct_id and $sesid[1] from localStorage", () => {
    const storage = {
      getItem(key: string) {
        return key === "ph_phc_test_posthog" ? stored : null;
      },
    };

    expect(readPostHogIdentity(token, { storage, cookie: "" })).toEqual({
      distinctId: "ph-visitor-1",
      sessionId: "ph-session-1",
    });
  });

  it("falls back to the URL-encoded cookie when storage has nothing", () => {
    const cookie = `other=1; ph_phc_test_posthog=${encodeURIComponent(stored)}`;

    expect(readPostHogIdentity(token, { storage: { getItem: () => null }, cookie })).toEqual({
      distinctId: "ph-visitor-1",
      sessionId: "ph-session-1",
    });
  });

  it("prefers the posthog object over storage", () => {
    const posthog = {
      get_distinct_id: () => "ph-visitor-1",
      get_session_id: () => "ph-session-1",
    };
    const storage = {
      getItem: () => JSON.stringify({ distinct_id: "other-visitor", $sesid: [1, "other-session"] }),
    };

    expect(readPostHogIdentity(token, { posthog, storage, cookie: "" })).toEqual({
      distinctId: "ph-visitor-1",
      sessionId: "ph-session-1",
    });
  });

  it("returns null when the opt-out storage key is 0", () => {
    const storage = {
      getItem(key: string) {
        if (key === "__ph_opt_in_out_phc_test") return "0";
        if (key === "ph_phc_test_posthog") return stored;
        return null;
      },
    };

    expect(readPostHogIdentity(token, { storage, cookie: "" })).toBeNull();
  });

  it("returns null when has_opted_out_capturing() is true", () => {
    const posthog = {
      has_opted_out_capturing: () => true,
      get_distinct_id: () => "ph-visitor-1",
      get_session_id: () => "ph-session-1",
    };

    expect(readPostHogIdentity(token, { posthog, storage: { getItem: () => stored }, cookie: "" })).toBeNull();
  });

  it("returns null when nothing is stored", () => {
    expect(readPostHogIdentity(token, { storage: { getItem: () => null }, cookie: "" })).toBeNull();
  });

  it("returns null when the JSON is broken", () => {
    const storage = {
      getItem(key: string) {
        return key === "ph_phc_test_posthog" ? "{not-json" : null;
      },
    };

    expect(readPostHogIdentity(token, { storage, cookie: "" })).toBeNull();
  });

  it("returns null when the token is empty", () => {
    expect(readPostHogIdentity("", { storage: { getItem: () => stored }, cookie: "" })).toBeNull();
  });

  it("returns null when the opt-out cookie is 0", () => {
    const cookie = `__ph_opt_in_out_phc_test=0; ph_phc_test_posthog=${encodeURIComponent(stored)}`;

    expect(readPostHogIdentity(token, { storage: { getItem: () => null }, cookie })).toBeNull();
  });

  it("returns null when distinct_id is missing", () => {
    const storage = {
      getItem: () => JSON.stringify({ $sesid: [1, "ph-session-1"] }),
    };

    expect(readPostHogIdentity(token, { storage, cookie: "" })).toBeNull();
  });

  it("returns null when storage access throws", () => {
    const storage = {
      getItem() {
        throw new Error("blocked");
      },
    };

    expect(readPostHogIdentity(token, { storage, cookie: "" })).toBeNull();
  });

  it("omits sessionId when the posthog session id is empty", () => {
    const posthog = {
      get_distinct_id: () => "ph-visitor-1",
      get_session_id: () => "",
    };

    expect(readPostHogIdentity(token, { posthog, storage: { getItem: () => stored }, cookie: "" })).toEqual({
      distinctId: "ph-visitor-1",
    });
  });
});
