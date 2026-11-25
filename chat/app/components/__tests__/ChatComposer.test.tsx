import { fireEvent, render, screen } from "@testing-library/react";
import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { ChatComposer } from "../ChatComposer.tsx";

function Composer({
  busy = false,
  initial = "",
  onKeyDown,
  onSubmit,
  onStop,
}: {
  busy?: boolean;
  initial?: string;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit?: (event: FormEvent) => void;
  onStop?: () => void;
}) {
  const [input, setInput] = useState(initial);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  return (
    <ChatComposer
      input={input}
      inputRef={inputRef}
      busy={busy}
      onChange={setInput}
      onKeyDown={onKeyDown ?? (() => {})}
      onSubmit={
        onSubmit ??
        ((event) => {
          event.preventDefault();
        })
      }
      onStop={onStop ?? (() => {})}
    />
  );
}

describe("ChatComposer", () => {
  it("keeps Send disabled until the input has text, then submits", () => {
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(<Composer onSubmit={onSubmit} />);

    const send = screen.getByRole("button", { name: "Send" });
    expect(send).toBeDisabled();

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "   " } });
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();

    fireEvent.change(input, { target: { value: "How do filters work?" } });
    expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("shows Stop while a reply is in progress", () => {
    const onStop = vi.fn();
    render(<Composer busy initial="How do filters work?" onStop={onStop} />);

    expect(screen.queryByRole("button", { name: "Send" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Stop" }));
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it("forwards Enter from the textarea", () => {
    const onKeyDown = vi.fn();
    render(<Composer onKeyDown={onKeyDown} />);

    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onKeyDown.mock.calls[0]?.[0].key).toBe("Enter");
  });

  it("notes that chats are logged and links to the privacy policy", () => {
    render(<Composer />);
    expect(screen.getByText(/Chats are logged to improve answers/)).toBeInTheDocument();
    const policy = screen.getByRole("link", { name: "Privacy policy" });
    expect(policy).toHaveAttribute("href", "https://www.meilisearch.com/privacy-policy");
    expect(policy).toHaveAttribute("target", "_blank");
    expect(policy).toHaveAttribute("rel", "noopener");
  });
});
