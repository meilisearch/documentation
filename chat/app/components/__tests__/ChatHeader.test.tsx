import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChatHeader } from "../ChatHeader.tsx";

function renderHeader(
  props: Partial<{ desktop: boolean; hasMessages: boolean; maximized: boolean }> = {},
) {
  const onClear = vi.fn();
  const onToggleSize = vi.fn();
  const onClose = vi.fn();
  const view = render(
    <ChatHeader
      desktop={props.desktop ?? false}
      hasMessages={props.hasMessages ?? false}
      maximized={props.maximized ?? false}
      onClear={onClear}
      onToggleSize={onToggleSize}
      onClose={onClose}
    />,
  );
  return { ...view, onClear, onToggleSize, onClose };
}

describe("ChatHeader", () => {
  it("shows Clear only when the chat has messages", () => {
    const { rerender, onClear, onToggleSize, onClose } = renderHeader({ desktop: true, hasMessages: false });
    expect(screen.queryByRole("button", { name: "Clear chat history" })).not.toBeInTheDocument();

    rerender(
      <ChatHeader
        desktop
        hasMessages
        maximized={false}
        onClear={onClear}
        onToggleSize={onToggleSize}
        onClose={onClose}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Clear chat history" }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("shows the size button only on desktop and flips its label when maximized", () => {
    const { rerender, onClear, onToggleSize, onClose } = renderHeader({
      desktop: false,
      hasMessages: true,
      maximized: false,
    });
    expect(screen.queryByRole("button", { name: "Maximize assistant panel" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Minimize assistant panel" })).not.toBeInTheDocument();

    rerender(
      <ChatHeader desktop hasMessages maximized={false} onClear={onClear} onToggleSize={onToggleSize} onClose={onClose} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Maximize assistant panel" }));
    expect(onToggleSize).toHaveBeenCalledTimes(1);

    rerender(
      <ChatHeader desktop hasMessages maximized onClear={onClear} onToggleSize={onToggleSize} onClose={onClose} />,
    );
    expect(screen.queryByRole("button", { name: "Maximize assistant panel" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Minimize assistant panel" }));
    expect(onToggleSize).toHaveBeenCalledTimes(2);
  });

  it("closes the panel from the close button", () => {
    const { onClose } = renderHeader();
    fireEvent.click(screen.getByRole("button", { name: "Close assistant panel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
