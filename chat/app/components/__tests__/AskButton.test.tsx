import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TOGGLE_EVENT } from "../../lib/events.ts";
import { AskButton } from "../AskButton.tsx";

describe("AskButton", () => {
  it("dispatches the toggle event and shows the shortcut", () => {
    const onToggle = vi.fn();
    window.addEventListener(TOGGLE_EVENT, onToggle);

    try {
      render(<AskButton />);
      fireEvent.click(screen.getByRole("button", { name: "Ask AI" }));

      expect(TOGGLE_EVENT).toBe("meili-chat:toggle");
      expect(onToggle).toHaveBeenCalledTimes(1);
      const event = onToggle.mock.calls[0]?.[0] as Event;
      expect(event).toBeInstanceOf(CustomEvent);
      expect(event.type).toBe(TOGGLE_EVENT);

      const shortcut = /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘I" : "Ctrl+I";
      expect(screen.getByText(shortcut).tagName).toBe("KBD");
    } finally {
      window.removeEventListener(TOGGLE_EVENT, onToggle);
    }
  });
});
