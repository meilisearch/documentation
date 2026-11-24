import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../../theme.css?inline", () => ({
  default: "@property --meili-test { syntax: \"*\"; inherits: false; initial-value: 0; }\n.rule{}",
}));

import { createShadowHost, hoistAtProperties, hoistLayoutStyles, placeButton } from "../shadow.ts";

afterEach(() => {
  document.body.replaceChildren();
  document.getElementById("meili-chat-properties")?.remove();
  document.getElementById("meili-chat-layout")?.remove();
});

describe("createShadowHost", () => {
  it("puts the stylesheet in the shadow root and returns the container", () => {
    const css = ".panel { color: red; }";
    const { host, container } = createShadowHost("meili-chat-host", css);

    expect(host.id).toBe("meili-chat-host");
    expect(host.shadowRoot).not.toBeNull();
    expect(host.shadowRoot?.querySelector("style")?.textContent).toBe(css);
    expect(container.tagName).toBe("DIV");
    expect(container.parentNode).toBe(host.shadowRoot);
  });
});

describe("hoistAtProperties", () => {
  it("does nothing when the stylesheet has no @property rules", () => {
    hoistAtProperties(".rule { color: red; }");
    expect(document.getElementById("meili-chat-properties")).toBeNull();
  });

  it("copies only @property rules and ignores a second call", () => {
    hoistAtProperties(`
      .rule { color: red; }
      @property --panel { syntax: "*"; inherits: false; initial-value: 0; }
      @property --gap { syntax: "<number>"; inherits: true; initial-value: 1; }
    `);

    const style = document.getElementById("meili-chat-properties");
    expect(style?.parentElement).toBe(document.head);
    expect(style?.textContent).toContain('@property --panel { syntax: "*"; inherits: false; initial-value: 0; }');
    expect(style?.textContent).toContain('@property --gap { syntax: "<number>"; inherits: true; initial-value: 1; }');
    expect(style?.textContent).not.toContain(".rule");

    const first = style?.textContent;
    hoistAtProperties('@property --other { syntax: "*"; inherits: false; initial-value: 2; }');
    expect(document.querySelectorAll("#meili-chat-properties")).toHaveLength(1);
    expect(style?.textContent).toBe(first);
  });

  it("hoists @property rules from the widget stylesheet", () => {
    hoistAtProperties();
    const style = document.getElementById("meili-chat-properties");
    expect(style?.textContent).toContain("@property --meili-test");
    expect(style?.textContent).not.toContain(".rule");
  });
});

describe("hoistLayoutStyles", () => {
  it("installs the layout stylesheet once", () => {
    hoistLayoutStyles();
    hoistLayoutStyles();

    const styles = document.querySelectorAll("#meili-chat-layout");
    expect(styles).toHaveLength(1);
    expect(styles[0]?.parentElement).toBe(document.head);
    expect(styles[0]?.textContent).toContain("--meili-chat-width");
    expect(styles[0]?.textContent).toContain('data-meili-chat="open"');
  });
});

describe("placeButton", () => {
  it("inserts the host after the custom search bar", () => {
    const custom = document.createElement("div");
    custom.id = "meilisearch-bar-container";
    const mintlify = document.createElement("div");
    mintlify.id = "search-bar-entry";
    document.body.append(mintlify, custom);

    const host = document.createElement("div");
    placeButton(host);

    expect(custom.nextElementSibling).toBe(host);
    expect(mintlify.nextElementSibling).toBe(custom);
  });

  it("falls back to the Mintlify search entry", () => {
    const mintlify = document.createElement("div");
    mintlify.id = "search-bar-entry";
    document.body.append(mintlify);

    const host = document.createElement("div");
    placeButton(host);

    expect(mintlify.nextElementSibling).toBe(host);
  });

  it("does nothing when neither anchor exists", () => {
    const host = document.createElement("div");
    const after = vi.spyOn(Element.prototype, "after");

    placeButton(host);

    expect(after).not.toHaveBeenCalled();
    expect(host.parentElement).toBeNull();
    after.mockRestore();
  });

  it("does nothing when the host is already next to the anchor", () => {
    const anchor = document.createElement("div");
    anchor.id = "meilisearch-bar-container";
    const host = document.createElement("div");
    document.body.append(anchor, host);
    const after = vi.spyOn(anchor, "after");

    placeButton(host);

    expect(after).not.toHaveBeenCalled();
    expect(anchor.nextElementSibling).toBe(host);
  });
});
